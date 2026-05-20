export default function CardFace({
  card,
  updateCardText,
}) {
  return (
    <textarea
      value={card.text}
      onChange={(e) =>
        updateCardText(card.id, e.target.value)
      }
      placeholder="Write something..."
      style={{
        pointerEvents: "auto",
        width: "100%",
        height: "100%",
        resize: "none",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "white",
        fontSize: "16px",
        padding: "10px",
        boxSizing: "border-box",
      }}
    />
  );
}