import { Scene, Color, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { Float32BufferAttribute, Uint16BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, AdditiveBlending, Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createModel } from './commands.js';
import levels from './levels/index.js';
import { CornerTable } from './topology/corner-table.js';
import { arrayFill } from './topology/util.js';
import { computeEdges } from './edge.js';

let scene, camera, renderer, controls;
// let cube;

let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

init();
let frame = requestAnimationFrame(animate);

function createLineMesh(vertices, indices, color) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new Uint16BufferAttribute(indices, 1));

  const material = new LineBasicMaterial({
    depthTest: false,
    depthWrite: false,
    color
  });

  return new LineSegments(geometry, material);
}

function createTriMesh(vertices, indices, color) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(new Uint16BufferAttribute(indices, 1));

  const material = new MeshBasicMaterial({
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    color
  });

  return new Mesh(geometry, material);
}

function createRenderNode(data) {
  const group = new Group();
  group.add(createTriMesh(data.vertices, data.faces, '#060608'));
  group.add(createLineMesh(data.vertices, data.edges, '#404244'));
  group.add(createLineMesh(data.vertices, data.seams, 'orange'));
  group.add(createLineMesh(data.vertices, data.misaligned, 'red'));
  return group;
}

function computeRenderInfo(geometry, edges) {
  const indEdges = [];
  const indSeams = [];
  const indMisaligned = [];

  for (const edge of edges) {
    let indices = indEdges;
    if (edge.isSeam) {
      indices = indSeams;
    } else if (edge.isMisaligned) {
      indices = indMisaligned;
    }
    indices.push(edge.p0, edge.p1);
  }

  return {
    vertices: geometry.posAttribute.values,
    faces: geometry.getPositionConnectivity(),
    edges: indEdges,
    seams: indSeams,
    misaligned: indMisaligned
  };
}

function init() {
  scene = new Scene();
  scene.background = new Color(0x202124);

  camera = new PerspectiveCamera(50, 1, 4, 80000);
  camera.position.z = 40000;

  renderer = new WebGLRenderer();

  controls = new OrbitControls(camera, renderer.domElement);


  const model = createModel(levels.sa[0]);
  // scene.add(model.buildGfx());
  // const geometry = model.createGeometry();
  // geometry.deduplicateAttributeValues();
  // geometry.deduplicateVertices();
  //
  // const posIndex = geometry.getPositionConnectivity();
  // const cornerTable = new CornerTable();
  // cornerTable.init(posIndex);

  const geometry = model.createGeometry();
  const edges = computeEdges(geometry);
  const renderInfo = computeRenderInfo(geometry, edges);
  const group = createRenderNode(renderInfo);
  scene.add(group);



  // ttm.forEach(commands => scene.add(createModel(commands).buildGfx()));

  // scene.add(createModel(ttm[0]).buildGfx());

  const ambient = new AmbientLight(0xffffff, 0.3);
  const light = new DirectionalLight(0xffffff, 1.2);
  light.position.set(-0.4, 0.6, 0.5).normalize();
  scene.add(ambient, light);

  // cube = new Mesh(
  //   new BoxGeometry(400, 400, 400),
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
