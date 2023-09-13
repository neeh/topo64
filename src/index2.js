import { Scene, Color, PerspectiveCamera, WebGLRenderer } from 'three';
import { BoxGeometry, BufferGeometry, Float32BufferAttribute, MeshBasicMaterial, LineBasicMaterial, AdditiveBlending, Mesh, LineSegments } from 'three';
import { Vector3, Plane, Triangle, Line3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Edge, GeometryData } from './geometry-data.js';

let scene, camera, renderer, controls;
// let cube;

let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

const tmp_ = new Vector3();
const tmp2_ = new Vector3();

function createTriangleMesh(triangles, color) {
  const vertices = [];
  for (const triangle of triangles) {
    triangle.a.toArray(vertices, vertices.length);
    triangle.b.toArray(vertices, vertices.length);
    triangle.c.toArray(vertices, vertices.length);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  const material = new MeshBasicMaterial({
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    color
  });

  return new Mesh(geometry, material);
}

function createLineMesh(lines, color) {
  const vertices = [];
  for (const line of lines) {
    line.start.toArray(vertices, vertices.length);
    line.end.toArray(vertices, vertices.length);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  const material = new LineBasicMaterial({
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    color: '#202124'
  });

  return new LineSegments(geometry, material);
}

function createEdgeMesh(edges, color) {
  const vertices = [];

  for (const edge of edges) {

  }

  // TODO
}

function createMisalignedEdgeMesh(edges, color) {
  const vertices = [];
  for (const edge of edges) {
    const { p0, p1 } = edge;
    tmp_.subVectors(p1, p0);

    const t = edge.misalignedSections.bounds;
    for (let i = 0; i < t.length; ++i) {
      tmp2_.copy(p0).addScaledVector(tmp_, t[i]).toArray(vertices, vertices.length);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

  const material = new LineBasicMaterial({ color });

  return new LineSegments(geometry, material);
}


function init() {
  scene = new Scene();
  scene.background = new Color(0x202124);

  camera = new PerspectiveCamera(50, 1, 4, 80000);
  camera.position.z = 40;

  renderer = new WebGLRenderer();

  controls = new OrbitControls(camera, renderer.domElement);

  const seam = new Line3(
    new Vector3(-20, 0, 0),
    new Vector3(20, 0, 0)
  );

  const t1 = new Triangle(
    new Vector3(-18, 0, -4),
    new Vector3(-9, 0, 7),
    new Vector3(-2, 0, -15)
  );

  const t2 = new Triangle(
    new Vector3(-8, 0, -4),
    new Vector3(-7, 0, 5),
    new Vector3(-2, 0, 2)
  );

  const t3 = new Triangle(
    new Vector3(0, 0, -8),
    new Vector3(-4, 0, -1),
    new Vector3(4, 0, -1)
  );

  const t4 = new Triangle(
    new Vector3(7, 0, 0),
    new Vector3(7, 0, 6),
    new Vector3(13, 0, 0)
  );

  const t5 = new Triangle(
    new Vector3(15, 0, -4),
    new Vector3(14, 0, 6),
    new Vector3(18, 0, 6)
  );

  const t6 = new Triangle(
    new Vector3(15, 0, -4),
    new Vector3(18, 0, 6),
    new Vector3(30, 0, 0)
  );

  // Collision
  const geometryData = new GeometryData();
  const triangles = [t1, t2, t3, t4, t5, t6];
  triangles.forEach(tri => geometryData.addTriangle(tri.a, tri.b, tri.c));

  const seamEdge = new Edge(seam.start, seam.end);
  seamEdge.markSeam();

  geometryData.edges.push(seamEdge);
  geometryData.findMisalignedSeamSections();

  // Rendering
  const triMesh = createTriangleMesh(triangles, '#08080A');
  scene.add(triMesh);

  const lineMesh = createLineMesh([seam]);
  scene.add(lineMesh);

  const misalignedEdgesMesh = createMisalignedEdgeMesh([seamEdge], 'yellow');
  scene.add(misalignedEdgesMesh);

  // cube = new Mesh(
  //   new BoxGeometry(40, 40, 40),
  //   new MeshBasicMaterial({ color: 'green', wireframe: true })
  // );
  // scene.add(cube);

  window.addEventListener('resize', onResize);
  onResize();

  document.body.appendChild(renderer.domElement);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
  frame = requestAnimationFrame(animate);

  if (lastTime === 0) lastTime = time;
  const delta = (time - lastTime) * playbackSpeed;
  globalTime += delta;
  lastTime = time;
  const dt = delta * 0.001;

  // cube.rotation.y += dt * 1.17293402;
  // cube.rotation.x += dt * 0.8912312;

  renderer.render(scene, camera);
}

init();
let frame = requestAnimationFrame(animate);
