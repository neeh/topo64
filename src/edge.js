import { Vector3, Triangle } from 'three';
import { CornerTable } from './topology/corner-table.js';
import { arrayFill } from './topology/util.js';

class Edge {
  constructor(p0, p1, faceId = -1) {
    this.p0 = p0;
    this.p1 = p1;
    // We store the face index so that we don't
    // test the edge against its own face
    this.faceId = faceId;

    this.length = 0;

    this.isSeam = false;
    this.isMisaligned = false;
  }
}

class GeometryUtil {
  constructor(geometry) {
    this.geometry = geometry;

    this.vertices = [];
    this.triangles = [];
    this.normals = [];

    this.edges = [];
    this.cornerToEdge = [];

    this.cornerTable = new CornerTable();
  }

  init() {
    this.geometry.deduplicateAttributeValues();
    this.geometry.deduplicateVertices();

    const posAttribute = this.geometry.posAttribute;
    const positions = posAttribute.values;
    const numPositions = posAttribute.numValues;

    this.vertices.length = 0;
    for (let i = 0; i < numPositions; ++i) {
      this.vertices[i] = new Vector3().fromArray(positions, i * 3);
    }

    const indices = this.geometry.getPositionConnectivity();
    const numTriangles = indices.length / 3 | 0;

    this.triangles.length = 0;
    this.normals.length = 0;
    for (let i = 0, j = 0; i < numTriangles; i++, j += 3) {
      const a = this.vertices[indices[j]];
      const b = this.vertices[indices[j + 1]];
      const c = this.vertices[indices[j + 2]];
      this.triangles[i] = new Triangle(a, b, c);

      this.normals[i] = new Vector3();
      this.triangles[i].getNormal(this.normals[i]);
    }

    this.cornerTable.init(indices);
    const cornerTable = this.cornerTable;
    const oppositeCorner = this.cornerTable.oppositeCorner;

    this.edges.length = 0;
    arrayFill(this.cornerToEdge, null, indices.length, true);
    for (let i = 0; i < indices.length; ++i) {
      if (this.cornerToEdge[i] !== null) continue;

      const oppCornerId = oppositeCorner[i];

      const sourceId = indices[cornerTable.next(i)];
      const sinkId = indices[cornerTable.previous(i)];

      const edge = new Edge(sourceId, sinkId);
      edge.length = this.vertices[sourceId].distanceTo(this.vertices[sinkId]);

      this.cornerToEdge[i] = edge;
      if (oppCornerId > -1) {
        this.cornerToEdge[oppCornerId] = edge;
      } else {
        edge.isSeam = true;
      }
      this.edges.push(edge);
    }
  }

  markMisalignedEdges() {
    for (let i = 0; i < this.edges.length; ++i) {
      this.edges[i].isMisaligned = false;
    }

    const oppositeCorner = this.cornerTable.oppositeCorner;

    for (let i = 0, j = 0; i < this.triangles.length; ++i, j += 3) {
      const bcEdge = this.cornerToEdge[j];
      const caEdge = this.cornerToEdge[j + 1];
      const abEdge = this.cornerToEdge[j + 2];

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

      const oppCornerId = oppositeCorner[j + baseId];
      if (oppCornerId === -1) continue;

      const oppFaceId = Math.floor(oppCornerId / 3);

      const normal = this.normals[i];
      const oppNormal = this.normals[oppFaceId];
      if (normal.dot(oppNormal) > 0.2) continue;

      const area = this.triangles[i].getArea();
      const height = 2 * area / base;
      if (height / base > 0.075) continue;

      for (let k = 0; k < 3; ++k) {
        if (k === baseId) continue;

        const oppK = oppositeCorner[j + k];
        if (oppK > -1) {
          const faceId = Math.floor(oppK / 3);

          if (oppNormal.dot(this.normals[faceId]) > 0.9) {
            this.cornerToEdge[j + k].isMisaligned = true;
            this.cornerToEdge[j + baseId].isMisaligned = true;
          }
        }
      }
    }
  }
}

export function computeEdges(geometry) {
  const geoUtil = new GeometryUtil(geometry);
  geoUtil.init();
  geoUtil.markMisalignedEdges();
  return geoUtil.edges;
}
