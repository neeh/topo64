import { Vector3, Plane, Triangle } from 'three';
import { CornerTable } from './topology/corner-table.js';
import { arrayFill } from './topology/util.js';
import { Edge } from './edge.js';

const EPS = 0.1;
// ^ SM64 collision models use integers
//   hence the big epsilon

const points_ = [];
const tmp_ = new Vector3();

export class GeometryData {
  constructor(geometry) {
    this.geometry = geometry;

    this.indices = null;
    this.cornerTable = null;

    this.vertices = [];

    this.faces = [];
    this.facePlanes = [];
    this.faceEdgePlanes = [];

    this.edges = [];
    this.cornerToEdge = [];

    this._init();
  }

  _init() {
    this.geometry.deduplicateAttributeValues();
    this.geometry.deduplicateVertices();

    this.indices = this.geometry.getPositionConnectivity();
    this.cornerTable = new CornerTable();
    this.cornerTable.init(this.indices);

    const positions = this.geometry.posAttribute.values;
    const numPositions = this.geometry.posAttribute.numValues;

    for (let i = 0; i < numPositions; ++i) {
      this.vertices[i] = new Vector3().fromArray(positions, i * 3);
    }

    const numTriangles = this.indices.length / 3 | 0;
    for (let i = 0, corner = 0; i < numTriangles; i++, corner += 3) {
      const a = this.vertices[this.indices[corner]];
      const b = this.vertices[this.indices[corner + 1]];
      const c = this.vertices[this.indices[corner + 2]];
      this._addTriangle(a, b, c);
    }

    this._computeEdges();
  }

  _addTriangle(a, b, c) {
    const triangle = new Triangle(a, b, c);
    this.faces.push(triangle);

    const plane = new Plane();
    plane.setFromCoplanarPoints(a, b, c);
    const normal = plane.normal;
    this.facePlanes.push(plane);

    points_[0] = a;
    points_[1] = b;
    points_[2] = c;

    const edgePlanes = [];
    for (let i = 0; i < 3; ++i) {
      const p0 = points_[(i + 1) % 3];
      const p1 = points_[(i + 2) % 3];

      tmp_.addVectors(p1, normal);

      edgePlanes.push(new Plane().setFromCoplanarPoints(p0, p1, tmp_));
    }
    this.faceEdgePlanes.push(edgePlanes);
  }

  _computeEdges() {
    arrayFill(this.cornerToEdge, null, this.indices.length, true);

    for (let corner = 0; corner < this.indices.length; ++corner) {
      if (this.cornerToEdge[corner] !== null) continue;

      const sourceId = this.indices[this.cornerTable.next(corner)];
      const sinkId = this.indices[this.cornerTable.previous(corner)];
      const source = this.vertices[sourceId];
      const sink = this.vertices[sinkId];
      const faceId = Math.floor(corner / 3);

      const edge = new Edge(source, sink, sourceId, sinkId, faceId);
      this.cornerToEdge[corner] = edge;

      const oppCornerId = this.cornerTable.oppositeCorner[corner];
      if (oppCornerId > -1) {
        this.cornerToEdge[oppCornerId] = edge;
      } else {
        edge.markSeam();
      }
      this.edges.push(edge);
    }
  }

  findMisalignedSeamSections() {
    for (const edge of this.edges) {
      if (!edge.isSeam) continue;

      edge.clearSections();
      const { p0, p1, faceId, delta } = edge;

      // NOTE: Bruteforce for now
      // UPDATE: It turns out bruteforce is not an issue for SM64 models
      for (let i = 0; i < this.faces.length; ++i) {
        // Do not test the edge against its own face
        if (i === faceId) continue;

        const plane = this.facePlanes[i];
        const edgePlanes = this.faceEdgePlanes[i];

        const d0 = plane.distanceToPoint(p0);
        const d1 = plane.distanceToPoint(p1);

        if (Math.abs(d0) < EPS && Math.abs(d1) < EPS) {
          let min = 0, max = 1;
          for (let j = 0; j < edgePlanes.length && min < max; ++j) {
            const edgePlane = edgePlanes[j];
            const denom = delta.dot(edgePlane.normal);
            if (denom === 0) {
              // seam is parallel to side
              if (edgePlane.distanceToPoint(p0) > EPS) {
                // seam is outside the face, early out
                max = min;
              }
            } else {
              const t = -edgePlane.distanceToPoint(p0) / denom;
              if (denom < 0) {
                // seam points towards face, use max constraint
                min = Math.max(min, t);
              } else {
                // seam points away from the face, use min constraint
                max = Math.min(max, t);
              }
            }
          }
          edge.markAlignedSection(min, max);
        }
      }
    }
  }

  findMisalignedSeamSections2() {
    for (const edge of this.edges) {
      if (!edge.isSeam) continue;

      const normEps = 0.001; // angle
      const lowerThreshold = 0.001;
      const upperThreshold = 5;

      edge.clearSections();
      const { p0, p1, faceId, delta, dir } = edge;

      // NOTE: Bruteforce for now
      // UPDATE: It turns out bruteforce is not an issue for SM64 models
      for (let i = 0; i < this.faces.length; ++i) {
        // Do not test the edge against its own face
        if (i === faceId) continue;

        const face = this.faces[i];
        const plane = this.facePlanes[i];
        const edgePlanes = this.faceEdgePlanes[i];

        // seam is not aligned to face
        const eps = 0.01;
        const dirDotNormal = Math.abs(dir.dot(plane.normal));
        if (dirDotNormal > eps) continue;

        const d0 = plane.distanceToPoint(p0);
        const d1 = plane.distanceToPoint(p1);

        // average distance from line to plane
        const d = Math.abs(d0 + d1) * 0.5;
        if (d > upperThreshold) continue;

        // slice test
        const ta = edge.relativeDistanceToPoint(face.a);
        const tb = edge.relativeDistanceToPoint(face.b);
        const tc = edge.relativeDistanceToPoint(face.c);
        if (ta <= 0 && tb <= 0 && tc <= 0) continue;
        if (ta >= 1 && tb >= 1 && tc >= 1) continue;

        // now check if the edge is inside or adjacent to the face
        let min = 0;
        let max = 1;
        let inside = true;
        for (let j = 0; j < edgePlanes.length; ++j) {
          const edgePlane = edgePlanes[j];

          // edge is sort of parallel -> not sure what eps to use here
          if (Math.abs(dir.dot(edgePlane.normal)) <= normEps) {
            // average edge distance
            const edgeDist = (edgePlane.distanceToPoint(p0) + edgePlane.distanceToPoint(p1)) * 0.5;
            if (edgeDist > upperThreshold) {
              // that edge of this face is too far away
              // --> early out with no result
              min = max;
              inside = false;
              break;
            } else if (edgeDist > lowerThreshold) {
              // the seam is almost touching the edge of this face
              // but it is not enough for the edge to be inside the face
              // --> project the edge along the seam and exit
              let t0 = ta, t1 = tb;
              if (j === 0) { t0 = tb; t1 = tc; }
              else if (j === 1) { t0 = tc; t1 = ta; }
              min = Math.min(t0, t1);
              max = Math.max(t0, t1);
              inside = false;
              break;
            }
            // the seam is either touching the edge of this face
            // OR the seam is inside this face
            // --> continue
          } else {
            // edge is not parallel find the interior bounds along the seam
            const denom = delta.dot(edgePlane.normal);
            const t = -edgePlane.distanceToPoint(p0) / denom;
            if (denom < 0) {
              // seam points towards face, use max constraint
              min = Math.max(min, t);
            } else {
              // seam points away from the face, use min constraint
              max = Math.min(max, t);
            }
          }
        }
        if (max > min) {
          if (d <= lowerThreshold && dirDotNormal <= normEps && inside) {
            edge.markAlignedSection(min, max);
          } else {
            edge.markMisalignedSection(min, max);
          }
        }
      }
      edge.updateSections();
    }
  }

  findFoldedEdges() {
    for (const edge of this.edges) edge.markFold(false);

    for (let i = 0, corner = 0; i < this.faces.length; ++i, corner += 3) {
      const bcEdge = this.cornerToEdge[corner];
      const caEdge = this.cornerToEdge[corner + 1];
      const abEdge = this.cornerToEdge[corner + 2];

      const bc = bcEdge.length;
      const ca = caEdge.length;
      const ab = abEdge.length;

      let base = bc;
      let baseId = 0;
      if (ca > bc && ca > ab) {
        base = ca;
        baseId = 1;
      } else if (ab > bc) {
        base = ab;
        baseId = 2;
      }

      const oppCornerId = this.cornerTable.oppositeCorner[corner + baseId];
      if (oppCornerId === -1) continue;

      const oppFaceId = Math.floor(oppCornerId / 3);

      const normal = this.facePlanes[i].normal;
      const oppNormal = this.facePlanes[oppFaceId].normal;
      if (normal.dot(oppNormal) > 0.2) continue;

      const area = this.faces[i].getArea();
      const height = 2 * area / base;
      if (height / base > 0.075) continue;

      for (let k = 0; k < 3; ++k) {
        if (k === baseId) continue;

        const oppK = this.cornerTable.oppositeCorner[corner + k];
        if (oppK > -1) {
          const faceId = Math.floor(oppK / 3);

          if (oppNormal.dot(this.facePlanes[faceId].normal) > 0.9) {
            this.cornerToEdge[corner + k].markFold();
            this.cornerToEdge[corner + baseId].markFold();
          }
        }
      }
    }
  }
}
