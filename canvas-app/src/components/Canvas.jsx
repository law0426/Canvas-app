
import { eventToWorld } from "../utils/coordinates";
import { useRef } from "react";

export default function Canvas({
  children,
  camera,
  onMove,
  stopAll,
  startPan,
  onWheel,
  addCard,
  setActiveCardId
}) {

  // Remembers whether this mouse press began on empty canvas.
  // useRef preserves the value between events without re-rendering.
  const pressStartedOnEmptyCanvas = useRef(false);

  function handleCanvasMouseDown(e) {
    pressStartedOnEmptyCanvas.current =
      e.target === e.currentTarget;
  }
  function handleAddCard(e) {
    // Don't create a card when the user clicked an existing card.
    if (
      !pressStartedOnEmptyCanvas.current ||
      e.target !== e.currentTarget
    ) {
      pressStartedOnEmptyCanvas.current = false;
      return;
    }

    pressStartedOnEmptyCanvas.current = false;

    // Canvas receives screen-space mouse coordinates.
    // Cards are stored in world-space, so convert before creating one.
    const world = eventToWorld(e, camera);

    const newCardId = addCard(world.x, world.y);
    setActiveCardId(newCardId);
  }
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
        onMouseDownCapture={handleCanvasMouseDown}
        onClick={handleAddCard}
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