import { Scene, Color, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import levels from './levels/index.js';
import { createModel } from './commands.js';
import { GeometryData } from './geometry-data.js';
import { createRenderObjects } from './rendering.js';

let scene, camera, renderer, controls;
let model;
let renderObjs;

let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

const RenderMode = {
  SOLID: 0,
  XRAY: 1
};
let renderMode = RenderMode.SOLID;

function setRenderMode(mode) {
  if (renderMode === mode) return;
  renderMode = mode;

  // I don't use scene.overrideMaterial here because I need a specific look
  // material for each type of object
  scene.traverse(node => {
    if (node.material && node.userData.materials) {
      const mat = node.userData.materials[renderMode];
      if (mat) {
        node.material = mat;
      }
    }
  });
}

function toggleRenderMode() {
  if (renderMode === RenderMode.SOLID) {
    setRenderMode(RenderMode.XRAY);
  } else {
    setRenderMode(RenderMode.SOLID);
  }
}

function init() {
  scene = new Scene();
  scene.background = new Color(0x202124);

  camera = new PerspectiveCamera(50, 1, 1, 50000);

  renderer = new WebGLRenderer({
    // logarithmicDepthBuffer: true,
    antialias: true
  });
  renderer.sortObjects = false;

  controls = new OrbitControls(camera, renderer.domElement);

  // SM64 model
  model = createModel(levels.bob[0]);

  // Geometry operations
  const geometryData = new GeometryData(model.createGeometry());
  geometryData.findMisalignedSeamSections2();
  geometryData.findFoldedEdges();

  // Three rendering
  renderObjs = createRenderObjects(geometryData);
  renderObjs.triangles.geometry.computeBoundingSphere();
  const { boundingSphere } = renderObjs.triangles.geometry;
  camera.position.set(-1, 2, 3).setLength(boundingSphere.radius * 2.5).add(boundingSphere.center);
  controls.target.copy(boundingSphere.center);
  controls.update();

  scene.add(renderObjs.group);

  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);
  onResize();

  document.body.appendChild(renderer.domElement);
}

function onKeyDown(e) {
  switch (e.code) {
  case 'Digit1':
    if (renderObjs) renderObjs.triangles.visible = !renderObjs.triangles.visible;
    break;
  case 'Digit2':
    if (renderObjs) renderObjs.edges.visible = !renderObjs.edges.visible;
    break;
  case 'Digit3':
    if (renderObjs) renderObjs.seams.visible = !renderObjs.seams.visible;
    break;
  case 'Digit4':
    if (renderObjs) renderObjs.boundary.visible = !renderObjs.boundary.visible;
    break;
  case 'Digit5':
    if (renderObjs) renderObjs.misaligned.visible = !renderObjs.misaligned.visible;
    break;
  case 'Digit6':
    if (renderObjs) renderObjs.folds.visible = !renderObjs.folds.visible;
    break;
  case 'KeyB':
    if (renderObjs) renderObjs.seams.visible = !renderObjs.seams.visible;
    break;
  case 'KeyE':
    toggleRenderMode();
    break;
  case 'KeyP':
    if (model) model.downloadObj();
    break;
  }
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

  renderer.render(scene, camera);
}

init();
let frame = requestAnimationFrame(animate);
