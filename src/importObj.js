import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
    name: "rope4",
    link: "/src/assets/rope4.glb",
  },
  {
    name: "ticket",
    link: "/src/assets/ticket.glb",
  },
];

function importObj(scene) {
  OBJECTS.forEach((obj) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(obj.link, (gltf) => {
      const root = gltf.scene;

      root.traverse((child) => {
        if (child.name.includes("rope")) {
          child.material = new THREE.MeshBasicMaterial({ color: 0x941e1e });
        }

        if (child.name === "Cloche") {
          child.material = new THREE.MeshPhysicalMaterial({
            reflectivity: 0.182,
            roughness: 0.347,
            metalness: 0.6,
            ior: 1,
            iridescence: 0,
            iridescenceIOR: 1.3,
            color: new THREE.Color(0xb39a1e),
            emissive: new THREE.Color(0x7d6717),
            specularColor: new THREE.Color(0xffffff),
            side: THREE.FrontSide,
          });
        }

        if (child.name === "BouleNeige") {
          child.traverse((c) => {
            if (c.name === "Cube014") {
              c.material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
              });
            }

            if (c.name === "Cube014_2") {
              c.material = new THREE.MeshBasicMaterial({
                color: 0x0c4700,
              });
            }
          });
          console.log(child);
        }
      });

      scene.add(root);
    });
  });
}

export default importObj;
