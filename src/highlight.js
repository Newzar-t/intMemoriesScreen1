function highlightObj(camera, object) {
  window.addEventListener("keyup", (event) => {
    if (event.key === "m") {
      camera.zoom = 5;
      camera.lookAt(object);
    }
  });
}

export default highlightObj;
