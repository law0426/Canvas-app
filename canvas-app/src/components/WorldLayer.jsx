export default function WorldLayer({
  children,
  camera,
}) {
  return (
    <div
      style={{
        pointerEvents: "none",
        
        transform: `
          translate(${camera.x}px, ${camera.y}px)
          scale(${camera.zoom})
        `,
        transformOrigin: "0 0",

        
        position: "relative",

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