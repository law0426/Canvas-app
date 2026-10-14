
import { useState } from "react";

export default function useAppState() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [recentCardIds, setRecentCardIds] = useState([]);
  const [isTextManipulating, setIsTextManipulating] = useState(false);

  function endTextManipulation() {
    setIsTextManipulating(false);

    // Remove actual browser focus when leaving text mode.
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLTextAreaElement
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

  return {
    activeCardId,
    recentCardIds,
    isTextManipulating,
    selectCard,
    beginTextManipulation,
    endTextManipulation,
    handleCardDeleted,
  };
}