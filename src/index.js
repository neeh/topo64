import { Scene, Color, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createModel } from './commands.js';
import ttm from './levels/ttm/index.js';

let scene, camera, renderer, controls;
// let cube;

let lastTime = 0;
let globalTime = 0;
let playbackSpeed = 1;

init();
let frame = requestAnimationFrame(animate);

function init() {
  scene = new Scene();
  scene.background = new Color(0x202124);

  camera = new PerspectiveCamera(50, 1, 4, 80000);
  camera.position.z = 40000;

  renderer = new WebGLRenderer();

  controls = new OrbitControls(camera, renderer.domElement);

  ttm.forEach(commands => scene.add(createModel(commands).buildGfx()));

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
