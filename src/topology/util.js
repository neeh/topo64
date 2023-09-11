
export function arrayCopy(src, dst = [], clip = false) {
  const len = src.length;
  for (let i = 0; i < len; ++i) {
    dst[i] = src[i];
  }
  if (clip && dst.length !== len) {
    dst.length = len;
  }
  return dst;
}

export function arrayFill(arr, val, len = arr.length, clip = false) {
  for (let i = 0; i < len; ++i) {
    arr[i] = val;
  }
  if (clip && arr.length !== len) {
    arr.length = len;
  }
}

export function arrayIdx(len, dst = [], clip = false) {
  for (let i = 0; i < len; ++i) {
    dst[i] = i;
  }
  if (clip && dst.length > len) {
    dst.length = len;
  }
  return dst;
}

export function arrayMax(arr) {
  const len = arr.length;
  if (len === 0) return NaN;
  let max = arr[0];
  for (let i = 1; i < len; ++i) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

export function getUintArray(maxValue) {
  if (maxValue < 0xFF) return Uint8Array;
  if (maxValue < 0xFFFF) return Uint16Array;
  return Uint32Array;
}
