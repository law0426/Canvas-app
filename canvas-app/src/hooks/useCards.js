// useCards.js

import { useState } from "react";

export default function useCards() {
    const [cards, setCards] = useState([
        { id: 1, x: 100, y: 100, text: "Edit me" }
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