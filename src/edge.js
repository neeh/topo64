import { Vector3 } from 'three';
import { IntervalSet } from './interval-set.js';

const tmp_ = new Vector3();

export class Edge {
  constructor(p0, p1, i0, i1, faceId = -1) {
    this.p0 = p0;
    this.p1 = p1;

    // Vertex indices are used for rendering
    this.i0 = i0;
    this.i1 = i1;

    // We store the face index so that we don't
    // test the edge against its own face
    this.faceId = faceId;

    this.length = p1.distanceTo(p0);
    this.oneOverLength = 1 / this.length;

    this.delta = new Vector3().subVectors(p1, p0);
    this.dir = new Vector3().copy(this.delta).normalize();

    this.isSeam = false;
    this.isFold = false;

    // but now we have a problem:

    this.alignedSections = new IntervalSet();
    this.misalignedSections = new IntervalSet();
    this.boundarySections = new IntervalSet();
    // this.buriedSections = new IntervalSet();
  }

  clearSections() {
    this.alignedSections.clear();
    this.misalignedSections.clear();
    // this.buriedSections.clear();

    // if (this.isSeam) {
    //   this.misalignedSections.add(0, 1);
    // }
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

    // this.misalignedSections.remove(min, max, 1e-7);
    this.alignedSections.add(min, max, 1e-7);
  }

  markMisalignedSection(min, max) {
    if (!this.isSeam) return;

    this.misalignedSections.add(min, max, 1e-7);
  }

  // markburiedSection(min, max) {
  //   if (!this.isSeam) return;
  //
  //   this.misalignedSections.remove(min, max, 1e-7);
  //   this.buriedSections.add(min, max, 1e-7);
  // }

  updateSections(min, max) {
    if (!this.isSeam) return;

    this.boundarySections.copy(this.alignedSections).union(this.misalignedSections, 1e-7).invert();
    this.misalignedSections.difference(this.alignedSections, 1e-7);
  }

  relativeDistanceToPoint(point) {
    const distance = tmp_.subVectors(point, this.p0).dot(this.dir);
    return distance * this.oneOverLength;
  }
}
