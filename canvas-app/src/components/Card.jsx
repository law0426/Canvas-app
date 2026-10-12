import { useState } from "react";
import CardFace from "./CardFace";
import CardBack from "./CardBack";
import CardOptions from "./CardOptions";


export default function Card({
  card,
  activeCardId,
  camera,
  setActiveCardId,
  setIsDragging,
  offset,
  eventToWorld,
  updateText,
  beginTextManipulation,
  endTextManipulation,
  removeCard
}) {
  const [flipped, setFlipped] = useState(false);
    /*
    cards:
    Stores every card on the canvas.

    Each card has:
    - id      -> unique identifier
    - x, y    -> world position on canvas
    - text    -> editable content

    useState causes React to re-render whenever cards change.
  */
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
          height: card.height ?? "auto",
          minHeight: 60,
          padding: 8,

          background: "#fff",
          cursor: "move",
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