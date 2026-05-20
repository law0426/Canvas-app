/*
  Convert world-space coordinates
  into screen-space coordinates.

  Render equation:

  screen = (world + camera) * zoom
*/
export function worldToScreen(x, y, camera) {
  return {
    x: (x + camera.x) * camera.zoom,
    y: (y + camera.y) * camera.zoom,
  };
}

/*
  Convert screen-space coordinates
  into world-space coordinates.

  Inverse of:

  screen = (world + camera) * zoom
*/
export function screenToWorld(x, y, camera) {
  return {
    x: x / camera.zoom - camera.x,
    y: y / camera.zoom - camera.y,
  };
}

/*
  Mouse event helper.

  Converts browser mouse coordinates
  directly into world-space.
*/
export function eventToWorld(e, camera) {
  return screenToWorld(
    e.clientX,
    e.clientY,
    camera
  );
}