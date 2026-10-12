// useCards.js

import { useState } from "react";

export default function useCards() {
    const [cards, setCards] = useState([
        {
            id: 1,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            width: 560,
            height: 280,
            text: `Welcome to your canvas!

Double-click empty space to create a card.
Drag empty space to pan the canvas.
Middle-mouse drag also pans.
Drag a card's border to move it.
Click text on a selected card to edit.
Click empty space to deselect.
Press Space to center the selected or last selected card
and reset zoom.

Use the buttons above a selected card to switch sides
or delete it.

Note: Cards aren't saved yet. Refreshing resets your work.` 
        },
    ]);

    function addCard(x, y) {
        const newCardId = Date.now();
        setCards(prev => [
            ...prev,
            {
                id: newCardId,
                x,
                y,
                text: "New card",
                tagIds: [
                    "philosophy",
                    "ai",
                    "science",
                    "art",
                ]
            }
        ]);
        return newCardId;
    }

    function updatePosition(id, x, y) {
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, x, y }
                    : card
            )
        );
    }

    function updateText(id, text) {
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, text }
                    : card
            )
        );
    }

    function removeCard(id) {
        setCards(prev =>
            prev.filter(card => card.id !== id)
        );
    }

    return {
        cards,
        addCard,
        updatePosition,
        updateText,
        removeCard
    };
}