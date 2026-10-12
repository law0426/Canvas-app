
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

  const canvasGesture = useRef(null);

  function handleCanvasMouseDown(e) {
    canvasGesture.current = {
      startedOnEmptyCanvas:
        e.button === 0 && e.target === e.currentTarget,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  }

  function handleCanvasMouseMoveCapture(e) {
    const gesture = canvasGesture.current;

    if (!gesture || gesture.moved) return;

    const dx = e.clientX - gesture.startX;
    const dy = e.clientY - gesture.startY;

    // Treat movement greater than 5px as a drag, not a click.
    if (Math.hypot(dx, dy) > 5) {
      gesture.moved = true;
    }
  }

  function handleCanvasClick(e) {
    const gesture = canvasGesture.current;

    // Only a stationary click on empty canvas deselects.
    if (
      e.target !== e.currentTarget ||
      !gesture?.startedOnEmptyCanvas ||
      gesture.moved
    ) {
      return;
    }

    setActiveCardId(null);
  }

  function handleAddCard(e) {
    const gesture = canvasGesture.current;
    canvasGesture.current = null;

    if (
      !gesture ||
      !gesture.startedOnEmptyCanvas ||
      gesture.moved ||
      e.target !== e.currentTarget
    ) {
      return;
    }

    const world = eventToWorld(e, camera);
    const newCardId = addCard(world.x, world.y);
    setActiveCardId(newCardId);
  }
  return (
    <div
      onMouseMove={onMove}
      onMouseUp={stopAll}
      onMouseLeave={stopAll}
      
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
        onMouseMoveCapture={handleCanvasMouseMoveCapture}
        onMouseDown={startPan}
        onClick={handleCanvasClick}
        onDoubleClick={handleAddCard}
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