export default function WorldLayer({
  children,
  camera,
  addCard,
}) {
  return (
    <div
      onClick={addCard}
      style={{
        /*
          Temporary behavior-preserving transform.

          Zoom still happens here for now.

          Later:
          - camera logic
          - projection math
          - render equations

          will be cleaned up incrementally.
        */
        transform: `scale(${camera.zoom})`,
        transformOrigin: "0 0",

        /*
          World layer fills viewport,
          but is NOT the viewport itself.
        */
        width: "100%",
        height: "100%",
        position: "relative",

        /*
          Temporary debug border.
          Remove later.
        */
        border: "2px solid red",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}