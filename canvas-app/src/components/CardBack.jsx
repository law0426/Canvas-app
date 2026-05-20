import { tags } from "../systems/tags";


export default function CardBack({
  card,
}) {
  return (
    <div
      style={{
        pointerEvents: "auto",
        width: "100%",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box",
        color: "white",
      }}
    >
      <strong>Tags</strong>

      <div style={{ marginTop: "10px" }}>
        {card.tagIds?.length ? (
            card.tagIds.map((tagId) => {

            const tag = tags[tagId];

            return (
                <div
                key={tagId}
                style={{
                    color: tag?.color || "white",
                    marginBottom: "4px",
                }}
                >
                #{tagId}
                </div>
            );
            })
        ) : (
            "No tags yet"
        )}
        </div>
    </div>
  );
}