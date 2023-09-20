import { Scene, Color, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createModel } from './commands.js';
import { GeometryData } from './geometry-data.js';
import { createRenderObjects } from './rendering.js';
import { level, faces, edges, seams, bounds, gaps, folds, xray } from './stores.js';

let scene, camera, renderer, controls;
let cube;

let curModelCmds = null;
let curModel = null;
let curRenderObjs = null;

let frame;
let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

const RenderMode = {
  SOLID: 0,
  XRAY: 1
};
let renderMode = RenderMode.SOLID;

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
  renderer.setPixelRatio(1);

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
  faces.subscribe(enabled => curRenderObjs && (curRenderObjs.triangles.visible = enabled));
  edges.subscribe(enabled => curRenderObjs && (curRenderObjs.edges.visible = enabled));
  seams.subscribe(enabled => curRenderObjs && (curRenderObjs.seams.visible = enabled));
  bounds.subscribe(enabled => curRenderObjs && (curRenderObjs.boundary.visible = enabled));
  gaps.subscribe(enabled => curRenderObjs && (curRenderObjs.misaligned.visible = enabled));
  folds.subscribe(enabled => curRenderObjs && (curRenderObjs.folds.visible = enabled));
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

  renderer.render(scene, camera);
}
