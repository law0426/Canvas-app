
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CardFace({
  card,
  updateText,
  beginTextManipulation,
  endTextManipulation,
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: card.text || "",
    onUpdate: ({ editor }) => {
      updateText(card.id, editor.getHTML());
    },
    onFocus: beginTextManipulation,
    onBlur: endTextManipulation,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "10px",
        overflowY: "auto",
        background: "transparent",
        color: "black",
      }}
    >
      <EditorContent
        editor={editor}
        style={{ height: "100%" }}
      />
    </div>
  );
}
