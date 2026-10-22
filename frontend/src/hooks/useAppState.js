
import { useCallback, useEffect, useRef, useState } from "react";

export default function useAppState() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [recentCardIds, setRecentCardIds] = useState([]);
  const [isTextManipulating, setIsTextManipulating] = useState(false);
  const editorsRef = useRef(new Map());

  const registerCardEditor = useCallback((id, editor) => {
    if (editor) {
      editorsRef.current.set(id, editor);
    } else {
      editorsRef.current.delete(id);
    }
  }, []);

  function endTextManipulation() {
    setIsTextManipulating(false);

    // Remove actual browser focus when leaving text mode.
    if (
      typeof document !== "undefined" &&
      (
        document.activeElement instanceof HTMLTextAreaElement ||
        (
          document.activeElement instanceof HTMLElement &&
          document.activeElement.isContentEditable
        )
      )
    ) {
      document.activeElement.blur();
    }
  }

  function selectCard(id) {
    setActiveCardId(id);
    endTextManipulation();

    if (id === null) return;

    // Most recently selected card goes first; keep 10 unique IDs.
    setRecentCardIds(prev =>
      [id, ...prev.filter(existingId => existingId !== id)].slice(0, 10)
    );
  }

  function beginTextManipulation() {
    if (activeCardId !== null) {
      setIsTextManipulating(true);
    }
  }

  function handleCardDeleted(id) {
    // Deleted cards must not remain in selection history.
    setRecentCardIds(prev =>
      prev.filter(existingId => existingId !== id)
    );

    if (activeCardId === id) {
      selectCard(null);
    }
  }

  // Route undo/redo to the selected card, independently of editor focus.
  useEffect(() => {
    function handleUndoRedo(e) {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;

      const key = e.key.toLowerCase();
      const isUndo = key === "z" && !e.shiftKey;
      const isRedo =
        (key === "z" && e.shiftKey) ||
        (key === "y" && !e.shiftKey);

      if (!isUndo && !isRedo) return;

      // ↓ Block native undo/redo even when no card is selected.
      e.preventDefault();
      e.stopPropagation();

      if (activeCardId === null) return;

      const editor = editorsRef.current.get(activeCardId);

      if (!editor || editor.isDestroyed) return;

      if (isRedo) {
        editor.commands.redo();
      } else {
        editor.commands.undo();
      }
    }

    window.addEventListener("keydown", handleUndoRedo, true);
    return () => {
      window.removeEventListener("keydown", handleUndoRedo, true);
    };
  }, [activeCardId]);

  return {
    activeCardId,
    recentCardIds,
    isTextManipulating,
    selectCard,
    beginTextManipulation,
    endTextManipulation,
    handleCardDeleted,
    registerCardEditor,
  };
}