export default function CardBack({
  card,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box",
        color: "white",
      }}
    >
      <strong>Tags</strong>

      <div style={{ marginTop: "10px" }}>
        {card.tags?.length
          ? card.tags.join(", ")
          : "No tags yet"}
      </div>
    </div>
  );
}