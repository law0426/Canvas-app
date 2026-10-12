


export default function CardOptions({
  flipped,
  setFlipped,
  x,
  y,
  cardId,
  removeCard,
  setActiveCardId,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x + 75,
        top: y - 75,
        zIndex: 101,
        pointerEvents: "auto",
        display: "flex",
        gap: "6px",
      }}
    >
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setFlipped((prev) => !prev);
        }}
      >
        {flipped ? "Edit" : "Tags"}
      </button>

      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          removeCard(cardId);
          setActiveCardId(null);
        }}
      >
        Delete
      </button>
    </div>
  );
}