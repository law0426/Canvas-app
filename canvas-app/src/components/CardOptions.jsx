


export default function CardOptions({
  flipped,
  setFlipped,
  x,
  y,
  cardWidth,
  cardId,
  removeCard,
  setActiveCardId,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x + cardWidth / 2 + 8,
        top: y,
        transform: "translateY(-50%)",
        zIndex: 101,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
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