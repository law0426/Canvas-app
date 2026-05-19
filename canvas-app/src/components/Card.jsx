export default function Card({
  card,
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
        left: card.x,
        top: card.y,

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