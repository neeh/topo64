import { Group, BufferAttribute, BufferGeometry, MeshBasicMaterial, MeshPhongMaterial, MeshMatcapMaterial, Mesh, EdgesGeometry, LineSegments, LineBasicMaterial, Color, AdditiveBlending } from 'three';
import { SurfaceColors } from './surface-terrains.js';
import { Geometry } from './topology/geometry.js';

export class CollisionModel {
  constructor() {
    this.vertices = [];
    this.batches = [];
    this.specialObjs = [];
    this.waterBoxes = [];
  }

  buildGfx() {
    const group = new Group();

    const positions = new Float32Array(this.vertices.length * 3);
    for (let i = 0, ofs = 0; i < this.vertices.length; ++i, ofs += 3) {
      const vertex = this.vertices[i];
      positions[ofs] = vertex[0];
      positions[ofs + 1] = vertex[1];
      positions[ofs + 2] = vertex[2];
    }
    const posAttribute = new BufferAttribute(positions, 3);

    for (const batch of this.batches) {
      const { tris } = batch;
      const indices = new Uint16Array(tris.length * 3);
      for (let i = 0, ofs = 0; i < tris.length; ++i, ofs += 3) {
        const tri = tris[i];
        indices[ofs] = tri[0];
        indices[ofs + 1] = tri[1];
        indices[ofs + 2] = tri[2];
      }

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', posAttribute);
      geometry.setIndex(new BufferAttribute(indices, 1));
      geometry.computeVertexNormals();

      const color = new Color(SurfaceColors[batch.type]).multiplyScalar(0.01);

      const material = new MeshBasicMaterial({
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        color,
        // wireframe: true
      });

      group.add(new Mesh(geometry, material));
      // group.add(new LineSegments(new EdgesGeometry(geometry), new LineBasicMaterial({ color: 'white' })));
    }

    // for (const waterBox of this.waterboxes) {
    //
    // }

    return group;
  }

  createGeometry(geometry) {
    if (!geometry) {
      geometry = new Geometry();
      geometry.createAttribute(0, 6, 3);
    }
    const posAttribute = geometry.posAttribute;

    const vertexId = geometry.numVertices;

    const positions = [];
    for (let i = 0, j = 0; i < this.vertices.length; ++i, j += 3) {
      const vertex = this.vertices[i];
      positions[j] = vertex[0];
      positions[j + 1] = vertex[1];
      positions[j + 2] = vertex[2];
    }
    posAttribute.appendVertices(positions);

    const indices = [];
    for (const batch of this.batches) {
      const { tris } = batch;
      for (let i = 0, ofs = 0; i < tris.length; ++i, ofs += 3) {
        const tri = tris[i];
        indices.push(tri[0], tri[1], tri[2]);
      }
    }
    geometry.appendIndex(indices);

    geometry.numVertices += this.vertices.length;
    return geometry;
  }
}
