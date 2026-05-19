// Convert screen-space coordinates into world-space
export function screenToWorld(x, y, camera) {
  return {
    x: x / camera.zoom - camera.x,
    y: y / camera.zoom - camera.y,
  };
}

// Convert world-space coordinates into screen-space
export function worldToScreen(x, y, camera) {
  return {
    x: x * camera.zoom + camera.x,
    y: y * camera.zoom + camera.y,
  };
}

// World plane is centered around origin,
// so screen coordinates must be offset into it.
const WORLD_OFFSET = 50000;

// Convert mouse event directly into world-space
export function eventToWorld(e, camera) {
  return screenToWorld(
    e.clientX + WORLD_OFFSET,
    e.clientY + WORLD_OFFSET,
    camera
  );
}

