import "./style.css";
import * as THREE from "three";
import importObj from "./importObj";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

async function loadEnv() {
  const loader = new HDRLoader();
  const envMap = await loader.loadAsync(
    "/src/assets/qwantani_noon_puresky_4k.hdr",
  );
  console.log("go");
  return envMap;
}

const mapTexture = loadEnv();
window.addEventListener("DOMContentLoaded", () => {
  main(mapTexture);
  const socket = new WebSocket("ws://localhost:8080");
  socket.addEventListener("message", (event) => {
    console.log("message arrivant", event.data)
  })
});

function main(envMap) {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 500;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-35, 83, 128);

  console.log(camera.position);
  const cameraHelper = new THREE.CameraHelper(camera);

  const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1,1000);
  camera2.position.set(40, 10, 30);
  camera2.lookAt(0, 5, 0);

  const cameraPole = new THREE.Object3D();

  cameraPole.add(camera);
  scene.add(cameraPole);
  scene.add(cameraHelper);

  const view1 = document.querySelector("#view1");
  const view2 = document.querySelector("#view2");

  const controls = new OrbitControls(camera, view1);
  controls.enableDamping = true;
  controls.update();

  const controls2 = new OrbitControls(camera2, view2);
  controls2.update();

  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom =
      Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
  }

  {
    const ambLight = new THREE.AmbientLight(0xffefc9, 4);
    ambLight.position.set(0, 30, 0);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfffceb, 5);
    cameraPole.add(dirLight);
  }

  importObj(scene, camera);

  function resizeRenderer(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  function animate(time) {
    time *= 0.001;

    resizeRenderer(renderer);

    renderer.setScissorTest(true);

    {
      const aspect = setScissorForElement(view1);

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      cameraHelper.update();

      cameraHelper.visible = false;
      scene.background.set(0xffffff);
      renderer.render(scene, camera);
    }

    {
      const aspect = setScissorForElement(view2);

      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();
      cameraHelper.update();
      cameraHelper.visible = true;
      scene.background.set(0x000040);
      renderer.render(scene, camera2);
    }

    /*  if (resizeRenderer(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;

      camera.updateProjectionMatrix();
    } */

    requestAnimationFrame(animate);
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "a") {
      console.log(camera.position);
    }
  });
  requestAnimationFrame(animate);
}
