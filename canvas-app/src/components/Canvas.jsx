export default function Canvas({
  children,
  camera,
  onMove,
  stopAll,
  startPan,
  onWheel,
  addCard,
}) {
  return (
    <div
      onMouseMove={onMove}
      onMouseUp={stopAll}
      onMouseDown={startPan}
      onWheel={onWheel}
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        overflow: "hidden",
      }}
    >
      <div
        onClick={addCard}
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: "0 0",

          // Large world-space plane
            width: "100000px",
            height: "100000px",

            // Center world around origin
            left: "-50000px",
            top: "-50000px",

            position: "absolute",
        }}
      >
        {children}
      </div>
    </div>
  );
}