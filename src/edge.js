import { Vector3 } from 'three';
import { IntervalSet } from './interval-set.js';

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
