
export class Attribute {
  constructor(type, dataType, itemSize) {
    this.type = type !== undefined ? type : Attribute.POSITION;
    this.dataType = dataType !== undefined ? dataType : Attribute.FLOAT;
    this.itemSize = itemSize !== undefined ? itemSize : 1;
    this.values = [];
    this.valuesMap = new Map();
    this.numValues = 0;
    this.index = [];
  }

  static INT8 = 0;
  static UINT8 = 1;
  static INT16 = 2;
  static UINT16 = 3;
  static INT32 = 4;
  static UINT32 = 5;
  static FLOAT32 = 6;

  static POSITION = 0;
  static TEXCOORD = 1;
  static NORMAL = 2;
  static MATERIAL = 3;
  static GENERIC = 4;

  clone() {
    return new Attribute().copy(this);
  }

  copy(attribute) {
    this.type = attribute.type;
    this.dataType = attribute.dataType;
    this.itemSize = attribute.itemSize;
    this.values = attribute.values.slice();
    this.valuesMap = new Map(attribute.valuesMap);
    this.index = attribute.index.slice();
  }

  numItems() {
    return this.index.length;
  }

  addNumberValue(value) {
    if (this.itemSize !== 1) {
      throw new Error('Attribute expects a vector value');
    }
    let valueId = this.valuesMap.get(value);
    if (valueId === undefined) {
      valueId = this.numValues++;
      this.values[valueId] = value;
      this.valuesMap.set(value, valueId);
    }
    return valueId;
  }

  // Adds a value and ensures it's unique
  // Returns the value index
  // Note that this function DOES NOT add any index
  // because that index may not even be required
  // if the values of all the attributes are duplicates
  addValue(buffer, src = 0) {
    let hash = buffer[src];
    for (let i = 1; i < this.itemSize; ++i) {
      hash += ',' + buffer[src + i];
    }
    let valueId = this.valuesMap.get(hash);
    if (valueId === undefined) {
      valueId = this.numValues++;
      const dst = valueId * this.itemSize;
      for (let i = 0; i < this.itemSize; ++i) {
        this.values[dst + i] = buffer[src + i];
      }
      this.valuesMap.set(hash, valueId);
    }
    return valueId;
  }

  // Beware: this function won't add the value in the hashmap
  // so it won't ever be deduplicated by calling "addUniqueValue"
  addValueUnsafe(buffer, src = 0) {
    const valueId = this.numValues++;
    const dst = valueId * this.itemSize;
    for (let i = 0; i < this.itemSize; ++i) {
      this.values[dst + i] = buffer[src + i];
    }
    return valueId;
  }

  copyValues(buffer) {
    const numValues = Math.floor(buffer.length / this.itemSize);
    const numItems = numValues * this.itemSize;
    for (let i = 0; i < numItems; ++i) {
      this.values[i] = buffer[i];
    }
    if (this.values.length > numItems) {
      this.values.length = numItems;
    }
  }

  appendValues(buffer) {
    const numValues = Math.floor(buffer.length / this.itemSize);
    const numItems = numValues * this.itemSize;
    for (let i = 0, j = this.numValues * this.itemSize; i < numItems; ++i, ++j) {
      this.values[j] = buffer[i];
    }
    this.numValues += numValues;
  }

  initLinearIndex() {
    for (let i = 0; i < this.numValues; ++i) {
      this.index[i] = i;
    }
  }

  appendLinearIndex(valueId, count) {
    const numItems = this.index.length;
    const il = numItems + count;
    for (let i = numItems; i < il; ++i, ++valueId) {
      this.index[i] = valueId;
    }
  }

  initConstantIndex(count) {
    for (let i = 0; i < count; ++i) {
      this.index[i] = 0;
    }
  }

  appendConstantIndex(valueId = 0, count = 1) {
    const numItems = this.index.length;
    const il = numItems + count;
    for (let i = numItems; i < il; ++i) {
      this.index[i] = valueId;
    }
  }

  appendVertices(buffer) {
    const numValues = this.numValues;
    this.appendValues(buffer);
    this.appendLinearIndex(numValues, this.numValues - numValues);
  }

  // TODO: Optimize the case where the attribute stores an index? (materialId?)
  // This function will:
  // - rebuild the entire values hashmap
  // - move all the duplicated values in the values array and resize the values array
  // - rewrite the index array to remove duplicates
  deduplicateValues() {
    // (1) Clear the current values hashmap
    this.valuesMap.clear();
    // (2) Rebuild the values hashmap and reorder values array
    let numUniqueValues = 0;
    const indexRemap = [];
    for (let i = 0, src = 0; i < this.numValues; ++i, src += this.itemSize) {
      let hash = this.values[src].toString();
      for (let j = 1; j < this.itemSize; ++j) {
        hash += ',' + this.values[src + j].toString();
      }
      let valueId = this.valuesMap.get(hash);
      if (valueId === undefined) {
        valueId = numUniqueValues++;
        indexRemap[i] = valueId;
        this.valuesMap.set(hash, valueId);
        if (valueId !== i) {
          const dst = valueId * this.itemSize;
          for (let j = 0; j < this.itemSize; ++j) {
            this.values[dst + j] = this.values[src + j];
          }
        }
      }
      indexRemap[i] = valueId;
    }
    // (3) Resize the values array
    this.values.length = numUniqueValues * this.itemSize;
    if (numUniqueValues === this.numValues) return;
    this.numValues = numUniqueValues;
    // (4) Rewrite the index array with the new mapping
    for (let i = 0; i < this.index.length; ++i) {
      this.index[i] = indexRemap[this.index[i]];
    }
  }
}
