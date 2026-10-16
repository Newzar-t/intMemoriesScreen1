import "./style.css";
import * as THREE from "three";
import importObj from "./importObj";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

async function main() {
  const loader = new HDRLoader();
  const envMap = await loader.loadAsync(
    "/src/assets/qwantani_noon_puresky_4k.hdr",
  );

  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 500;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 150, 50);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;

  {
    const ambLight = new THREE.AmbientLight(0xffefc9, 4);
    ambLight.position.set(0, 30, 0);
    scene.add(ambLight);
  }

  importObj(scene);

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

    if (resizeRenderer(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;

      camera.updateProjectionMatrix();
    }
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
