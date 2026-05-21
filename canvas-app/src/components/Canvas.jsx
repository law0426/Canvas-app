export default function Canvas({
  children,
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
      onMouseLeave={stopAll}
      onMouseDown={startPan}
      onWheel={onWheel}
      
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        overflow: "hidden",
        border: "2px solid cyan",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={addCard}
        style={{
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