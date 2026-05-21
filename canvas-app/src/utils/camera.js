import { useState } from "react";

export function useCamera() {

  /*
    Camera state.

    x, y:
    - world translation

    zoom:
    - world scale
  */
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });


  /*
    Reset camera
  */
  function resetCamera() {
    setCamera({
      x: 0,
      y: 0,
      zoom: 1,
    });
  }


  /*
    Zoom camera toward cursor.
  */
  function onWheel(e) {

    const zoomFactor = 1.2;

    const newZoom =
      e.deltaY < 0
        ? camera.zoom * zoomFactor
        : camera.zoom / zoomFactor;

    const clampedZoom =
      Math.min(3, Math.max(0.2, newZoom));

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    /*
      Convert cursor into world-space
      BEFORE zoom changes.
    */
    const worldX =
      (mouseX - camera.x) / camera.zoom;

    const worldY =
      (mouseY - camera.y) / camera.zoom;

    /*
      Recalculate translation
      so cursor remains anchored.
    */
    const newCameraX =
      mouseX - worldX * clampedZoom;

    const newCameraY =
      mouseY - worldY * clampedZoom;

    setCamera({
      x: newCameraX,
      y: newCameraY,
      zoom: clampedZoom,
    });
  }


  return {
    camera,
    setCamera,

    onWheel,
    resetCamera,
  };
}