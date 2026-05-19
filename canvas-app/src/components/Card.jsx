export default function Card({
  card,
  camera,
  startDrag,
  updateText,
}) {
  return (
    <div
      onMouseDown={(e) => startDrag(e, card)}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) =>
        updateText(card.id, e.currentTarget.textContent)
      }
      style={{
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
      {card.text}
    </div>
  );
}