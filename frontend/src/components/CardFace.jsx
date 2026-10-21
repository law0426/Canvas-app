import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const EMPTY_DOCUMENT = {
    type: "doc",
    content: [{ type: "paragraph" }],
};

export default function CardFace({
    card,
    isActive,
    updateText,
    beginTextManipulation,
    endTextManipulation,
}) {
  

    const editor = useEditor({
        extensions: [StarterKit],
        content: card.frontContent ?? EMPTY_DOCUMENT,

        onUpdate: ({ editor }) => {
            updateText(card.id, editor.getJSON());
        },

        onFocus: beginTextManipulation,
        onBlur: endTextManipulation,
    });

    useEffect(() => {
        if (!isActive && editor?.isFocused) {
            editor.commands.blur();
        }
    }, [editor, isActive]);

    return (
        <div
            data-no-canvas-zoom="true"
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