
export class IntervalSet {
  constructor(min = 0, max = 1, snappingTolerance = 0) {
    this.min = min;
    this.max = max;
    this.snappingTolerance = snappingTolerance;

    this.bounds = [];
    this.count = 0; // unused
  }

  clear() {
    this.bounds.length = 0;
    this.count = 0;
  }

  getIndexBefore(t) {
    t -= this.snappingTolerance;
    const b = this.bounds;
    let i = 1;
    for (; i < b.length && t > b[i]; i += 2);
    return i - 1;
  }

  resize(newSize, pivot = this.bounds.length) {
    const size = this.bounds.length;
    if (newSize === size) return;

    for (let i = size; i < newSize; i += 2) {
      this.bounds[i] = 0;
      this.bounds[i + 1] = 0;
    }

    const shift = newSize - size;
    const step = shift < 0 ? 1 : -1;
    const start = shift < 0 ? pivot : newSize - 1;
    const end = shift < 0 ? newSize : pivot + shift - 1;

    for (let i = start; i !== end; i += step) {
      this.bounds[i] = this.bounds[i - shift];
    }

    if (newSize > size) {
      for (let i = pivot; i <= end; i += 2) {
        this.bounds[i] = this.max;
        this.bounds[i + 1] = this.min;
      }
    } else if (newSize < size) {
      this.bounds.length = newSize;
    }
  }

  add(min, max) {
    if (min < this.min) min = this.min;
    if (max > this.max) max = this.max;
    if (min >= max) return;

    const minIndex = this.getIndexBefore(min);

    const b = this.bounds;
    let size = b.length;

    const t = max + this.snappingTolerance;
    let i = minIndex;
    for (; i < size && t >= b[i]; i += 2);

    const indexDelta = minIndex - i + 2;
    if (indexDelta !== 0) {
      size += indexDelta;
      this.resize(size, minIndex);
    }

    if (b[minIndex] > min) b[minIndex] = min;
    if (b[minIndex + 1] < max) b[minIndex + 1] = max;
  }

  remove(min, max) {
    if (min < this.min) min = this.min;
    if (max > this.max) max = this.max;
    if (min >= max) return;

    // NOTE: I think we shouldn't use the snapping tolerance for remove
    const minIndex = this.getIndexBefore(min);

    const b = this.bounds;
    let size = this.bounds.length;

    const t = max + this.snappingTolerance;
    let i = minIndex;
    for (; i < size && t >= b[i]; i += 2);

    const indexDelta = i - minIndex;
    if (indexDelta !== 0) {
      size += indexDelta;
      this.resize(size, minIndex);
    }

    // TODO
  }

  getInverse(ret = []) {
    const b = this.bounds;
    let start = 0;
    let end = b.length;

    if (end === 0 || b[0] !== this.min) {
      ret.push(this.min);
    } else {
      start = 1;
    }

    const lastIsMax = end > 0 && b[end - 1] === this.max;
    if (lastIsMax) --end;

    // NODE: might use this.count here
    for (let i = start; i < end; ++i) {
      ret.push(b[i]);
    }
    if (!lastIsMax) {
      ret.push(this.max);
    }
    return ret;
  }
}
