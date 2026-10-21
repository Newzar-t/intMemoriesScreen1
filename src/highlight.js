import gsap from "gsap";

function highlightObj(camera, object, initialZoom) {
  let tl = gsap.timeline();
  window.addEventListener("keyup", (event) => {
    if (event.key === "m") {
      tl.to(camera, {
        zoom: initialZoom,
        duration: 2,
        onUpdate: function () {
          camera.lookAt(0, 0, 0);
        },
      })
        .to(camera, {
          zoom: 5,
          ease: "power1",
          duration: 12,
          onUpdate: function () {
            camera.lookAt(object);
          },
        })
        .to(camera, {
          zoom: initialZoom,
          ease: "power1",
          duration: 5,
          onComplete: function () {
            camera.lookAt(0, 0, 0);
          },
        });
    }
  });
}

export default highlightObj;
