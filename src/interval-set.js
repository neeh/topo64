
export class IntervalSet {
  constructor(min = 0, max = 1) {
    this.min = min;
    this.max = max;

    this.bounds = [];
    this.size = 0;
  }

  clear() {
    this.bounds.length = 0;
    this.size = 0;

    return this;
  }

  copy(src) {
    this.min = src.min;
    this.max = src.max;

    const b = src.bounds;
    for (let i = 0; i < b.length; ++i) {
      this.bounds[i] = b[i];
    }
    if (this.bounds.length > b.length) {
      this.bounds.length = b.length;
    }
    this.size = src.size;

    return this;
  }

  shift(offset, index = 0) {
    if (offset === 0) return;

    const b = this.bounds;
    if (offset > 0) {
      const end = index + offset
      for (let i = b.length - 1; i >= end; --i) {
        b[i] = b[i - offset];
      }
    } else {
      const end = b.length + offset;
      for (let i = index; i < end; ++i) {
        b[i] = b[i - offset];
      }
    }
  }

  // NOTE: Not sure if we want to shift() inside resize()
  resize(newSize, shiftPivot = this.bounds.length) {
    const size = this.bounds.length;
    if (newSize === size) return;

    for (let i = size; i < newSize; ++i) {
      this.bounds[i] = 0;
    }
    this.shift(newSize - size, shiftPivot);
    if (newSize < size) {
      this.bounds.length = newSize;
    }
    this.size = newSize;
  }

  add(min = 0, max = min, thickness = 0) {
    if (min < this.min) min = this.min;
    if (max > this.max) max = this.max;
    if (min >= max) return;

    const b = this.bounds;
    const size = b.length;

    let i = 1;
    let t = min - thickness;
    for (; i < size && t > b[i]; i += 2);
    const minIndex = --i;

    t = max + thickness;
    for (; i < size && t >= b[i]; i += 2);

    const minOutside = minIndex === size || min < b[minIndex];
    const maxOutside = i === 0 || max > b[i - 1];

    const indexDelta = minIndex - i + 2;
    if (indexDelta !== 0) {
      this.resize(size + indexDelta, minOutside ? minIndex : minIndex + 1);
    }

    if (minOutside) b[minIndex] = min;
    if (maxOutside) b[minIndex + 1] = max;

    return this;
  }

  // min   max   minIndex   i   minInside   maxInside    delta
  // 6     9     2          4   false       true         0
  // 9     15    2          4   true        false        0
  // 9     15    2          4   false       false        0 -> SHOULD BE -2
  // 8     10    2          4
  // WIP
  removeNew(min = 0, max = min, thickness = 0) {
    if (min < this.min) min = this.min;
    if (max > this.max) max = this.max;
    if (min >= max) return;

    const b = this.bounds;
    const size = b.length;

    let i = 1;
    let t = min - thickness;
    for (; i < size && t >= b[i]; i += 2);
    const minIndex = --i;

    t = max + thickness;
    for (; i < size && t > b[i]; i += 2);

    const minInside = minIndex > 0 && min > b[minIndex];
    const maxInside = i > 0 && max < b[i - 1];

    let indexDelta = minIndex - i + 2;
    if (minInside && maxInside) indexDelta += 2;
    if (!minInside && !maxInside) indexDelta -= 2;
    if (indexDelta !== 0) {
      this.resize(size + indexDelta, minIndex);
    }

    if (minInside && maxInside) {
      b[minIndex + 1] = min;
      b[minIndex + 2] = max;
    } else if (minInside) {
      b[minIndex + 1] = min;
    } else if (maxInside) {
      b[minIndex] = max;
    }

    return this;
  }

  remove(min = 0, max = min, thickness = 0) {
    if (min < this.min) min = this.min;
    if (max > this.max) max = this.max;
    if (min >= max) return;

    const b = this.bounds;
    const size = b.length;

    let i = 0;
    let t = min - thickness;
    for (; i < size && t > b[i]; ++i);

    // In the loops that find the min/max indices we want:
    // min > b[i] when i is even but min >= b[i] when i is odd
    // max > b[i] when i is even but max >= b[i] when i is odd
    // we patch this up with an if after each loop

    // i is odd, we are on a upper bound of an interval
    // check if we can get out of this interval
    // i < size should always be true since bounds come in pairs
    if (i & 1 && i < size && b[i] === t) ++i;
    const minIndex = i;
    const minInside = minIndex & 1;

    t = max + thickness;
    for (; i < size && t > b[i]; ++i);
    if (i & 1 && i < size && b[i] === t) ++i;
    const maxIndex = i;
    let maxInside = maxIndex & 1;

    // So far we have an interval range that includes the thickness
    // But the range of our actual bounds might differ
    const minReallyInside = minInside === 1 && min < b[minIndex];
    const maxReallyInside = maxInside === 1 && max > b[maxIndex - 1];

    const indexDelta = (minIndex + minInside) - (maxIndex - maxInside);
    if (indexDelta !== 0) {
      // In cases where our lower bound got pushed inside an interval
      // because of the thickness, then don't override the upper bound
      let pivot = minIndex;
      if (!minReallyInside) pivot += minInside;

      this.resize(size + indexDelta, pivot);
    }

    if (minReallyInside && maxReallyInside) {
      b[minIndex] = min;
      b[minIndex + 1] = max;
    } else if (minReallyInside) {
      b[minIndex] = min;
    } else if (maxReallyInside) {
      b[minIndex + minInside] = max;
    }

    return this;
  }

  invert() {
    const b = this.bounds;
    const size = b.length;

    const startOnMin = size > 0 && b[0] === this.min;
    const endOnMax = size > 0 && b[size - 1] === this.max;

    if (startOnMin && endOnMax) {
      this.shift(-1);
      this.resize(size - 2);
    } else if (startOnMin) {
      this.shift(-1);
      b[size - 1] = this.max;
    } else if (endOnMax) {
      this.shift(1);
      b[0] = this.min;
    } else {
      this.resize(size + 2);
      this.shift(1);
      b[0] = this.min;
      b[size + 1] = this.max;
    }
    return this;
  }

  union(intervals, thickness = 0) {
    const b = intervals.bounds;
    for (let i = 0; i < b.length; i += 2) {
      this.add(b[i], b[i + 1], thickness);
    }
    return this;
  }

  difference(intervals, thickness = 0) {
    const b = intervals.bounds;
    for (let i = 0; i < b.length; i += 2) {
      this.remove(b[i], b[i + 1], thickness);
    }
    return this;
  }
}
