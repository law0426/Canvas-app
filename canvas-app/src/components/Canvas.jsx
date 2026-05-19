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
          // World layer transform.
          // Viewport stays fixed.
          // Only rendered card positions move.
          transform: `scale(${camera.zoom})`,
          transformOrigin: "0 0",

          border: "2px solid red",
          boxSizing: "border-box",

          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}