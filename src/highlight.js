import gsap from "gsap";
import * as THREE from "three";

function highlightObj(camera, object, initialZoom) {
  const initialLook = new THREE.Vector3(0, 0, 0);
  const target = object.position.clone();
  const currentLook = initialLook.clone();

  let tl = null;

  const update = () => {
    camera.lookAt(currentLook);
    camera.updateProjectionMatrix();
  };

    if (tl) tl.kill();

    tl = gsap.timeline({ onUpdate: update });

      tl.to(camera, {
        zoom: initialZoom,
        duration: 0.1,
      })
        .to(camera, {
          zoom: 5,
          ease: "power1",
          duration: 3,
        })
        .to(
          currentLook,
          {
            x: target.x,
            y: target.y,
            z: target.z,
            ease: "power1",
            duration: 3,
          },
          "<",
        )
        .to(camera, {
          zoom: initialZoom,
          ease: "power1",
          duration: 3,
          delay: 10,
        })
        .to(
          currentLook,
          {
            x: initialLook.x,
            y: initialLook.y,
            z: initialLook.z,
            ease: "power1",
            duration: 3,
          },
          "<",
        );
    }

export default highlightObj;
