
import { useState, useRef, useEffect, useCallback } from "react";
import { eventToWorld } from "../utils/coordinates";

export default function useWorkspaceInteraction({
  cards,
  activeCardId,
  recentCardIds,
  isTextManipulating,
  camera,
  setCamera,
  resetCamera,
  updatePosition,
}) {
  const [isDragging, setIsDragging] = useState(false);

  // Preserves the cursor's offset from the card during dragging.
  const offset = useRef({ x: 0, y: 0 });

  // Tracks viewport panning independently of card dragging.
  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  function startPan(e) {
    // Middle mouse pans anywhere; left mouse pans on empty canvas.
    const isMiddleMouse = e.button === 1;
    const isLeftMouseOnBackground =
      e.button === 0 && e.target === e.currentTarget;

    if (!isMiddleMouse && !isLeftMouseOnBackground) return;

    e.preventDefault();
    panning.current = true;

    panStart.current = {
      x: e.clientX - camera.x,
      y: e.clientY - camera.y,
    };
  }

  function onMove(e) {
    // Move the active card.
    if (isDragging && activeCardId !== null) {
      const mouse = eventToWorld(e, camera);

      updatePosition(
        activeCardId,
        mouse.x - offset.current.x,
        mouse.y - offset.current.y
      );
    }

    // Move the viewport.
    if (panning.current) {
      setCamera((prev) => ({
        ...prev,
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      }));
    }
  }

  const stopAll = useCallback(() => {
    setIsDragging(false);
    panning.current = false;
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      const target = e.target;

      // Don't intercept ordinary input or text-editing shortcuts.
      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          target.matches("input, textarea, select, button")
        )
      ) {
        return;
      }

      if (isTextManipulating || e.code !== "Space") return;

      e.preventDefault();

      // Prefer the active card, then the most recently selected card.
      const activeCard = cards.find(
        (card) => card.id === activeCardId
      );

      const recentCardId = recentCardIds.find(
        (id) => cards.some((card) => card.id === id)
      );

      const targetCard =
        activeCard ??
        cards.find((card) => card.id === recentCardId);

      // Retain the existing reset behavior if no card can be targeted.
      if (!targetCard) {
        resetCamera();
        return;
      }

      // Center the card while preserving zoom.
      setCamera((prev) => ({
        ...prev,
        x: window.innerWidth / 2 - targetCard.x,
        y: window.innerHeight / 2 - targetCard.y,
        zoom: 1,
      }));
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseup", stopAll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mouseup", stopAll);
    };
  }, [
    activeCardId,
    recentCardIds,
    cards,
    isTextManipulating,
    setCamera,
    resetCamera,
    stopAll,
  ]);

  return {
    isDragging,
    setIsDragging,
    offset,
    startPan,
    onMove,
    stopAll,
  };
}