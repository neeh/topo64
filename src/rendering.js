import { Vector3, Float32BufferAttribute, Uint16BufferAttribute, BufferGeometry, MeshBasicMaterial, LineBasicMaterial, NoBlending, AdditiveBlending, DoubleSide, Mesh, LineSegments, Group } from 'three';

const tmp_ = new Vector3();

function createTriangleMesh(vertices, indices, color, xrayColor = color, forceSolid = false) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  if (indices) {
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
  }

  const material = new MeshBasicMaterial({
    blending: NoBlending,
    // side: DoubleSide,
    // polygonOffset: true,
    // polygonOffsetFactor: 1,
    // polygonOffsetUnits: 100,
    // transparent: true,
    // opacity: 0.1,
    color
  });

  const xrayMaterial = new MeshBasicMaterial({
    blending: forceSolid ? NoBlending : AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    color: xrayColor
  });

  const mesh = new Mesh(geometry, material)
  mesh.userData.materials = [material, xrayMaterial];

  return mesh;
}

function createLineMesh(vertices, indices, color, xrayColor = color, forceSolid = false) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  if (indices) {
    geometry.setIndex(new Uint16BufferAttribute(indices, 1));
  }

  const material = new LineBasicMaterial({
    blending: NoBlending,
    depthWrite: false,
    color
  });

  const xrayMaterial = new LineBasicMaterial({
    blending: forceSolid ? NoBlending : AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    color: xrayColor
  });

  const line = new LineSegments(geometry, material);
  line.userData.materials = [material, xrayMaterial];

  return line;
}

function createEdgeSectionMesh(edges, sectionType = 0, color, xrayColor, forceBlending) {
  const vertices = [];

  for (const edge of edges) {
    const { p0, p1, delta } = edge;

    const sections = sectionType === 0 ? edge.misalignedSections : edge.boundarySections;
    const t = sections.bounds;
    for (let i = 0; i < t.length; ++i) {
      tmp_.copy(p0).addScaledVector(delta, t[i]).toArray(vertices, vertices.length);
    }
  }
  return createLineMesh(vertices, null, color, xrayColor, forceBlending);
}

export function createRenderObjects(geometryData) {
  const vertices = geometryData.geometry.posAttribute.values;
  const indices = geometryData.indices;

  const indEdges = [];
  const indSeams = [];
  const indFolds = [];

  for (const edge of geometryData.edges) {
    if (edge.isSeam) {
      indSeams.push(edge.i0, edge.i1);
    } else if (edge.isFold) {
      indFolds.push(edge.i0, edge.i1);
    }
    indEdges.push(edge.i0, edge.i1);
  }

  const triangles = createTriangleMesh(vertices, indices, '#18181a', '#060608');
  const edges = createLineMesh(vertices, indEdges, '#36373d', '#0d0d10');
  const seams = createLineMesh(vertices, indSeams, '#A05000', '#804000', true);
  const folds = createLineMesh(vertices, indFolds, 'red', 'red', true);
  const boundary = createEdgeSectionMesh(geometryData.edges, 1, '#008080', '#007070', true);
  const misaligned = createEdgeSectionMesh(geometryData.edges, 0, 'aqua', 'aqua', true);

  const group = new Group();
  group.add(triangles, edges, seams, folds, boundary, misaligned);

  return {
    triangles,
    edges,
    seams,
    folds,
    boundary,
    misaligned,
    group
  };
}
