import { Group, BufferAttribute, BufferGeometry, MeshBasicMaterial, MeshPhongMaterial, MeshMatcapMaterial, Mesh } from 'three';
import { SurfaceColors } from './surface-terrains.js';

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

      const material = new MeshMatcapMaterial({
        color: SurfaceColors[batch.type],
        // wireframe: true
      });

      group.add(new Mesh(geometry, material));
    }

    // for (const waterBox of this.waterboxes) {
    //
    // }

    return group;
  }
}
