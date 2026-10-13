export default function CardFace({
  card,
  updateText,
  beginTextManipulation,
  endTextManipulation,
}) {
  return (
    <textarea
      value={card.text}
      onChange={(e) =>
        updateText(card.id, e.target.value)
      }
      onFocus={beginTextManipulation}
      onBlur={endTextManipulation}
      placeholder="Write something..."
      style={{
        pointerEvents: "auto",
        width: "100%",
        height: "100%",
        resize: "none",
        border: "none",
        outline: "none",
        background: "transparent",
        color: "black",
        fontSize: "16px",
        padding: "10px",
        boxSizing: "border-box",
      }}
    />
  );
}