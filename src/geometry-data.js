import { Vector3, Plane, Triangle } from 'three';
import { IntervalSet } from './interval-set.js';
import { CornerTable } from './topology/corner-table.js';
import { arrayFill } from './topology/util.js';

const EPS = 0.5;
// ^ SM64 collision models use integers
//   hence the big epsilon

const points_ = [];
const tmp_ = new Vector3();

export class Edge {
  constructor(p0, p1, i0, i1, faceId = -1) {
    this.p0 = p0;
    this.p1 = p1;

    this.i0 = i0;
    this.i1 = i1;

    // We store the face index so that we don't
    // test the edge against its own face
    this.faceId = faceId;

    this.length = p1.distanceTo(p0);
    this.delta = new Vector3().subVectors(p1, p0);

    this.isSeam = false;
    this.isFold = false;

    this.misalignedSections = new IntervalSet();
    this.buriedSections = new IntervalSet();
  }

  clearSections() {
    this.misalignedSections.clear();
    this.buriedSections.clear();

    if (this.isSeam) {
      this.misalignedSections.add(0, 1);
    }
  }

  markSeam(isSeam = true) {
    if (this.isSeam === isSeam) return;

    this.isSeam = isSeam;
    this.clearSections();
  }

  markFold(isFold = true) {
    this.isFold = isFold;
  }

  markAlignedSection(min, max) {
    if (!this.isSeam) return;

    this.misalignedSections.remove(min, max, 1e-7);
  }

  markburiedSection(min, max) {
    if (!this.isSeam) return;

    this.misalignedSections.remove(min, max, 1e-7);
    this.buriedSections.add(min, max, 1e-7);
  }
}

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
