import { useState, useEffect } from "react";
import CardFace from "./CardFace";
import CardBack from "./CardBack";
import CardOptions from "./CardOptions";


export default function Card({
  card,
  activeCardId,
  isTextManipulating,
  camera,
  setActiveCardId,
  setIsDragging,
  offset,
  eventToWorld,
  updateText,
  beginTextManipulation,
  endTextManipulation,
  updateSize,
  updatePosition,
  removeCard
}) {
  const [flipped, setFlipped] = useState(false);
  const [resizeState, setResizeState] = useState(null);
    
  function handleMouseDown(e) {
    if (e.button !== 0) return;

    // Selected textarea: allow normal text interaction.
    if (
      activeCardId === card.id &&
      e.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    // Unselected textarea: select and drag the card, not its text.
    if (e.target.tagName === "TEXTAREA") {
      e.preventDefault();
    } else {
      // Clicking elsewhere exits text manipulation.
      endTextManipulation();
    }

    setActiveCardId(card.id);
    setIsDragging(true);

    const mouse = eventToWorld(e, camera);

    offset.current = {
      x: mouse.x - card.x,
      y: mouse.y - card.y,
    };

    e.stopPropagation();
  }
  function handleResizeStart(e, direction) {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    // Resizing is not text manipulation or card dragging.
    endTextManipulation();
    setIsDragging(false);

    setResizeState({
      direction,
      startX: e.clientX,
      startY: e.clientY,
      x: card.x,
      y: card.y,
      width: card.width ?? 240,
      height: card.height ?? 180,
      zoom: camera.zoom,
    });
  }

  useEffect(() => {
    if (!resizeState) return;

    function handleResizeMove(e) {
      const dx = (e.clientX - resizeState.startX) / resizeState.zoom;
      const dy = (e.clientY - resizeState.startY) / resizeState.zoom;

      const horizontal = resizeState.direction.includes("e")
        ? 1
        : resizeState.direction.includes("w")
          ? -1
          : 0;

      const vertical = resizeState.direction.includes("s")
        ? 1
        : resizeState.direction.includes("n")
          ? -1
          : 0;

      const width = Math.max(
        120,
        resizeState.width + dx * horizontal
      );

      const height = Math.max(
        60,
        resizeState.height + dy * vertical
      );

      // Resize the card.
      updateSize(card.id, width, height);

      // Move its center so the opposite edge stays in place.
      updatePosition(
        card.id,
        resizeState.x + horizontal * (width - resizeState.width) / 2,
        resizeState.y + vertical * (height - resizeState.height) / 2
      );
    }

    function handleResizeEnd() {
      setResizeState(null);
    }

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [resizeState, card.id, updateSize, updatePosition]);
 
  return (
    <>
      <div
        //cards = {cards}
        onMouseDown={handleMouseDown}
        
        style={{
          pointerEvents: "auto",

          position: "absolute",
          // Render world-space card position relative to camera
          left: card.x,
          top: card.y,
          zIndex: activeCardId === card.id ? 100 : 0,
          transform: "translate(-50%, -50%)",
          boxShadow: activeCardId === card.id
            ? "inset 0 0 0 4px #4fb3a9"
            : "none",
          borderRadius: "10px",

          width: card.width ?? 240,
          height: card.height ?? 180,
          minHeight: 60,
          padding: 8,
          paddingTop: 16,
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          // flexDirection: "column",
          // gap: 6,
          background: "#fff",
          cursor: "move",
          userSelect:
            activeCardId === card.id && isTextManipulating
              ? "text"
              : "none",
        }}
      >
        {flipped ? (
          <CardBack card={card} />
        ) : (
          <CardFace
            card={card}
            updateText={updateText}
            beginTextManipulation={beginTextManipulation}
            endTextManipulation={endTextManipulation}
          />
        )}
        {activeCardId === card.id &&
          [
            {
              direction: "n",
              style: { top: 0, left: 8, right: 8, height: 6, cursor: "n-resize" },
            },
            {
              direction: "s",
              style: { bottom: 0, left: 8, right: 8, height: 6, cursor: "s-resize" },
            },
            {
              direction: "w",
              style: { left: 0, top: 8, bottom: 8, width: 6, cursor: "w-resize" },
            },
            {
              direction: "e",
              style: { right: 0, top: 8, bottom: 8, width: 6, cursor: "e-resize" },
            },
            {
              direction: "nw",
              style: { top: 0, left: 0, width: 10, height: 10, cursor: "nw-resize" },
            },
            {
              direction: "ne",
              style: { top: 0, right: 0, width: 10, height: 10, cursor: "ne-resize" },
            },
            {
              direction: "sw",
              style: { bottom: 0, left: 0, width: 10, height: 10, cursor: "sw-resize" },
            },
            {
              direction: "se",
              style: { bottom: 0, right: 0, width: 10, height: 10, cursor: "se-resize" },
            },
          ].map(({ direction, style }) => (
            <div
              key={direction}
              onMouseDown={(e) => handleResizeStart(e, direction)}
              style={{
                position: "absolute",
                zIndex: 5,
                background: "transparent",
                ...style,
              }}
            />
          ))}
      </div>
      
      {activeCardId === card.id && (
        <CardOptions
          flipped={flipped}
          setFlipped={setFlipped}
          x={card.x}
          y={card.y}
          cardId={card.id}
          removeCard={removeCard}
          setActiveCardId={setActiveCardId}
        />
      )}
    </>
  );
}