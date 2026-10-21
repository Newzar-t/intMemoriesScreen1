import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import highlightObj from "./highlight";

const OBJECTS = [
  {
    name: "BouleNeige",
    link: "/src/assets/bouleneige.glb",
  },
  {
    name: "Cloche",
    link: "/src/assets/cloche.glb",
  },
  {
    name: "rope1",
    link: "/src/assets/rope1.glb",
  },
  {
    name: "rope2",
    link: "/src/assets/rope2.glb",
  },
  {
    name: "rope3",
    link: "/src/assets/rope3.glb",
  },
  {
    name: "ticket",
    link: "/src/assets/ticket.glb",
  },
];

const ropeMat = new THREE.MeshBasicMaterial({ color: 0x941e1e });

const clocheMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0xe8a200),
  reflectivity: 0.3,
  roughness: 0,
  metalness: 0.8,
  ior: 0.8,
  color: 0xbd9d00,
  side: THREE.FrontSide,
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xc2d4ff,
  opacity: 0.6,
  transparent: true,
  depthWrite: false,
  reflectivity: 0.5,
  transmission: 0.1,
});
const socleMat = new THREE.MeshToonMaterial({ color: 0x4f2a19 });
const baseMat = new THREE.MeshToonMaterial({ color: 0x254f0d });
const treeMat = new THREE.MeshToonMaterial({ color: 0xffffff });
const giftMat = new THREE.MeshToonMaterial({ color: 0xcc5c72 });

function importObj(scene, camera) {
  OBJECTS.forEach((obj) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(obj.link, (gltf) => {
      const root = gltf.scene;

      root.traverse((child) => {
        if (child.name.includes("rope")) {
          child.material = ropeMat;
        }

        if (child.name.includes("clo")) {
          child.material = clocheMat;
          highlightObj(camera, child.position);
        }

        if (child.name === "socle") {
          child.material = socleMat;
        }

        if (child.name === "tree") {
          child.material = treeMat;
        }

        if (child.name.includes("base")) {
          child.material = baseMat;
        }

        if (child.name === "glass") {
          child.material = glassMat;
        }

        if (child.name.includes("gift")) {
          child.traverse((c) => {
            c.material = giftMat;
          });
        }
      });

      scene.add(root);
    });
  });
}

export default importObj;
