import { useState } from "react";
import CardFace from "./CardFace";
import CardBack from "./CardBack";

export default function Card({
  card,
  camera,
  startDrag,
  updateText,
}) {

  const [flipped, setFlipped] = useState(true);

  return (
    <div
      onMouseDown={(e) => startDrag(e, card)}
      
      style={{
        pointerEvents: "auto",

        position: "absolute",
        // Render world-space card position relative to camera
        left: card.x + camera.x,
        top: card.y + camera.y,

        minWidth: 120,
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
        />
      )}
    </div>
  );
}