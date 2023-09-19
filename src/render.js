import { Scene, Color, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let cube;

let frame;
let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

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

  controls = new OrbitControls(camera, renderer.domElement);

  cube = new Mesh(
    new BoxGeometry(1000, 1000, 1000),
    new MeshBasicMaterial({
      color: 'green',
      wireframe: true
    })
  );
  scene.add(cube);
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

  cube.rotation.x += dt * 0.4831;
  cube.rotation.y += dt * 0.2197;

  renderer.render(scene, camera);
}
