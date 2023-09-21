import { Vector3, Scene, Color, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createModel } from './commands.js';
import { GeometryData } from './geometry-data.js';
import { createRenderObjects } from './rendering.js';
import { level, faces, edges, seams, bounds, gaps, folds, xray } from './stores.js';

const RenderMode = {
  SOLID: 0,
  XRAY: 1
};

let scene, camera, renderer, controls;
let cube;

let curModelCmds = null;
let curModel = null;
let curRenderObjs = null;
let renderMode = RenderMode.SOLID;

const lastCameraPos = new Vector3();
const lastTargetPos = new Vector3();
let lastCameraAspect = 0;
let lastCameraLayersMask = 0;
let lastRenderMode = renderMode;
let lastModelCmds = null;

let frame;
let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

export function setRenderMode(mode) {
  if (renderMode === mode) return;
  renderMode = mode;
  updateSceneMaterials();
}

export function toggleRenderMode() {
  if (renderMode === RenderMode.SOLID) {
    setRenderMode(RenderMode.XRAY);
  } else {
    setRenderMode(RenderMode.SOLID);
  }
}

function updateSceneMaterials() {
  if (!scene) return;

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

export function init(canvas) {
  scene = new Scene();
  scene.background = new Color(0x202124);

  camera = new PerspectiveCamera(50, 1, 4, 80000);
  camera.position.set(4000, 2000, 0);

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    // logarithmicDepthBuffer: true
  });
  renderer.sortObjects = false;
  renderer.setPixelRatio(window.devicePixelRatio);

  controls = new OrbitControls(camera, renderer.domElement);

  // cube = new Mesh(
  //   new BoxGeometry(1000, 1000, 1000),
  //   new MeshBasicMaterial({
  //     color: 'green',
  //     wireframe: true
  //   })
  // );
  // scene.add(cube);

  if (curRenderObjs) {
    scene.add(curRenderObjs.group);
    updateSceneMaterials();
  }
  resetCamera();

  level.subscribe(setModelCommands);

  const layerStores = [faces, edges, seams, bounds, gaps, folds];
  for (let i = 0; i < layerStores.length; ++i) {
    const layer = i + 1;
    layerStores[i].subscribe(enabled => enabled ? camera.layers.enable(layer) : camera.layers.disable(layer));
  }

  xray.subscribe(enabled => setRenderMode(enabled ? RenderMode.XRAY : RenderMode.SOLID));
}

export function setModelCommands(modelCmds) {
  if (modelCmds === curModelCmds) return;

  console.log('setModelCommands ' + (modelCmds ? modelCmds.name : '-'));

  curModelCmds = null;
  curModel = null;
  if (curRenderObjs) {
    curRenderObjs.group.parent?.remove(curRenderObjs.group);
    curRenderObjs = null;
  }

  if (modelCmds) {
    curModelCmds = modelCmds;
    curModel = createModel(curModelCmds);

    const geometryData = new GeometryData(curModel.createGeometry());
    geometryData.findMisalignedSeamSections2();
    geometryData.findFoldedEdges();

    curRenderObjs = createRenderObjects(geometryData);
    curRenderObjs.triangles.geometry.computeBoundingSphere();
    if (scene) {
      scene.add(curRenderObjs.group);
      updateSceneMaterials();
    }
  }

  resetCamera();
}

export function resetCamera() {
  if (!(camera && controls)) return;

  if (curRenderObjs) {
    const { boundingSphere } = curRenderObjs.triangles.geometry;
    camera.position.set(-1, 2, 3).setLength(boundingSphere.radius * 2.5).add(boundingSphere.center);
    controls.target.copy(boundingSphere.center);
  } else {
    camera.position.set(0, 1000, -2000);
    controls.target.setScalar(0);
  }
  controls.update();
}

export function downloadObj() {
  if (!curModel) return;
  curModel.downloadObj();
}

export function setSize(width, height) {
  if (camera) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  if (renderer) {
    renderer.setSize(width, height);
  }
}

export function start() {
  frame = requestAnimationFrame(animate);
}

export function stop() {
  cancelAnimationFrame(frame);
}

function animate(time) {
  frame = requestAnimationFrame(animate);

  if (lastTime === 0) lastTime = time;
  const delta = (time - lastTime) * playbackSpeed;
  globalTime += delta;
  lastTime = time;
  const dt = delta * 0.001;

  // cube.rotation.x += dt * 0.4831;
  // cube.rotation.y += dt * 0.2197;

  const skipRender = (
    camera.position.equals(lastCameraPos) &&
    controls.target.equals(lastTargetPos) &&
    camera.aspect === lastCameraAspect &&
    camera.layers.mask === lastCameraLayersMask &&
    renderMode === lastRenderMode &&
    curModelCmds === lastModelCmds
  );
  if (!skipRender) {
    renderer.render(scene, camera);

    lastCameraPos.copy(camera.position);
    lastTargetPos.copy(controls.target);
    lastCameraAspect = camera.aspect;
    lastCameraLayersMask = camera.layers.mask;
    lastRenderMode = renderMode;
    lastModelCmds = curModelCmds;
  }
}
