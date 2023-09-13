import { Vector3, Plane } from 'three';
import { IntervalSet } from './interval-set.js';

const EPS = 1e-4;
const points_ = [];
const tmp_ = new Vector3();

export class Edge {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;

    this.length = p1.distanceTo(p0);

    // this.misalignedSections = new IntervalSet();
    this.alignedSections = new IntervalSet();
    // this.burriedSection = [];
  }

  markAlignedSection(min, max) {
    // this.misalignedSections.remove(min, max);
    this.alignedSections.add(min, max);
  }

  // markBurriedSection(min, max) {
  //
  // }
}

export class GeometryData {
  constructor() {
    this.vertices = [];

    this.edges = [];
    this.cornerToEdge = [];

    this.faces = [];
    this.facePlanes = [];
    this.faceEdgePlanes = [];
  }

  addTriangle(triangle) {
    const { a, b, c } = triangle;
    points_[0] = a;
    points_[1] = b;
    points_[2] = c;
    this.faces.push(triangle);

    const plane = new Plane();
    plane.setFromCoplanarPoints(a, b, c);
    const normal = plane.normal;
    this.facePlanes.push(plane);

    const edgePlanes = [];
    for (let i = 0; i < 3; ++i) {

      const p0 = points_[(i + 1) % 3];
      const p1 = points_[(i + 2) % 3];

      tmp_.addVectors(p1, normal);

      edgePlanes.push(new Plane().setFromCoplanarPoints(p0, p1, tmp_));
      // edgePlane.contant -= 0.0001; // Add some tickness
    }
    this.faceEdgePlanes.push(edgePlanes);
  }

  findMisalignedSeamSections(seam) {
    const { p0, p1 } = seam;

    tmp_.subVectors(p1, p0);

    for (let i = 0; i < this.faces.length; ++i) {
      const plane = this.facePlanes[i];
      const edgePlanes = this.faceEdgePlanes[i];

      const d0 = plane.distanceToPoint(p0);
      const d1 = plane.distanceToPoint(p1);

      if (Math.abs(d0) < EPS && Math.abs(d1) < EPS) {
        let min = 0, max = 1;
        for (let j = 0; j < edgePlanes.length && min < max; ++j) {
          const edgePlane = edgePlanes[j];
          const denom = tmp_.dot(edgePlane.normal);
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
        seam.markAlignedSection(min, max);
      }
    }
  }
}
