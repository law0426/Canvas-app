export default function WorldLayer({
  children,
  camera,
}) {
  return (
    <div
      style={{
        pointerEvents: "none",
        /*
          World transform layer.

          This owns:
          - zoom
          - later: pan transforms
          - later: spatial/world transforms

          NOT:
          - browser interaction
          - clipping
        */
        transform: `scale(${camera.zoom})`,
        transformOrigin: "0 0",

        /*
          Important:
          relative positioning allows
          absolutely-positioned cards
          to anchor correctly.
        */
        position: "relative",

        /*
          World layer should NOT clip cards.
        */
        overflow: "visible",

        width: "100%",
        height: "100%",
        border: "2px solid red",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}