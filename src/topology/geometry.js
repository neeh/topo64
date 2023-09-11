import { Attribute } from './attribute.js';

export class Geometry {
  constructor() {
    this.attributes = [];
    this.posAttribute = null;
    this.matAttribute = null;
    this.vertexMap = new Map();
    this.index = [];

    this.numVertices = 0;
    this.numFaces = 0;
  }

  numAttributes() {
    return this.attributes.length;
  }

  addAttribute(attribute) {
    if (attribute.type === Attribute.POSITION) {
      if (this.posAttribute) {
        throw new Error('Geometry already has a position attribute');
      }
      this.posAttribute = attribute;
    }
    if (attribute.type === Attribute.MATERIAL) {
      if (this.matAttribute) {
        throw new Error('Geometry already has a material attribute');
      }
      this.matAttribute = attribute;
    }
    if (this.attributes.length === 0) {
      this.numVertices = attribute.index.length;
    } else if (attribute.index.length !== this.numVertices) {
      throw new Error('Attribute must match Geometry vertex count');
    }
    this.attributes.push(attribute);
  }

  findAttribute(attributeType, start = 0) {
    for (let i = start; i < this.attributes.length; ++i) {
      if (this.attributes[i].type === attributeType) return this.attributes[i];
    }
    return null;
  }

  addVertex(valueIds) {
    let vertexHash = valueIds[0];
    for (let i = 1; i < this.attributes.length; ++i) {
      vertexHash += ',' + valuesIds[i].toString();
    }
    let vertexId = this.vertexMap.get(vertexHash);
    if (vertexId === undefined) {
      vertexId = this.numVertices++;
      this.vertexMap.set(vertexHash, vertexId);
    }
    return vertexId;
  }

  addFace(a, b, c) {
    const i = this.numFaces * 3;
    this.index[i] = a;
    this.index[i + 1] = b;
    this.index[i + 2] = c;
    this.numFaces++;
  }

  setIndex(index) {
    arrayCopy(index, this.index);
    this.numFaces = Math.floor(index.length / 3);
    if (this.index.length > this.numFaces * 3) {
      this.index.length = this.numFaces * 3;
    }
  }

  appendIndex(buffer, vertexId = this.numVertices, start = 0, count = buffer.length) {
    const numAddedFaces = Math.abs(count / 3);
    const startIndex = this.numFaces * 3;
    const il = numAddedFaces * 3;
    for (let i = start; i < il; ++i) {
      this.index[startIndex + i] = buffer[i] + vertexId;
    }
    this.numFaces += numAddedFaces;
  }

  appendLinearIndex(numAddedFaces, vertexId = this.numVertices, start = 0) {
    const startIndex = this.numFaces * 3;
    const il = numAddedFaces * 3;
    for (let i = start; i < il; ++i) {
      this.index[startIndex + i] = i + vertexId;
    }
    this.numFaces += numAddedFaces;
  }

  deduplicateAttributeValues() {
    for (let i = 0; i < this.attributes.length; ++i) {
      this.attributes[i].deduplicateValues();
    }
  }

  deduplicateVertices() {
    // (1) Clear the current vertex hashmap
    this.vertexMap.clear();
    // (2) Rebuild the vertex hashmap and reorder attribute arrays
    let numUniqueVertices = 0;
    const indexRemap = [];
    const numAttributes = this.attributes.length;
    for (let i = 0; i < this.numVertices; ++i) {
      let hash = '';
      for (let j = 0; j < numAttributes; ++j) {
        if (j > 0) hash += ',';
        hash += this.attributes[j].index[i];
      }
      let vertexId = this.vertexMap.get(hash);
      if (vertexId === undefined) {
        vertexId = numUniqueVertices++;
        this.vertexMap.set(hash, vertexId);
        if (vertexId !== i) {
          for (let j = 0; j < numAttributes; ++j) {
            index[vertexId] = this.attributes[j].index[i];
          }
        }
      }
      indexRemap[i] = vertexId;
    }
    // (3) Resize the attribute arrays
    for (let i = 0; i < numAttributes; ++i) {
      this.attributes[i].index.length = numUniqueVertices;
    }
    if (numUniqueVertices === this.numVertices) return;
    this.numVertices = numUniqueVertices;
    // (4) Remap faces with new vertex indices
    for (let i = 0; i < this.index.length; ++i) {
      this.index[i] = indexRemap[this.index[i]];
    }
  }

  getPositionConnectivity() {
    const index = [];
    const attrIndex = this.posAttribute.index;
    for (let i = 0; i < this.index.length; ++i) {
      index[i] = attrIndex[this.index[i]];
    }
    return index;
  }
}
