// useCards.js

import { useCallback, useState } from "react";

export default function useCards() {
    const [cards, setCards] = useState([]);

    const replaceCards = useCallback((nextCards) => {
        setCards(nextCards);
    }, []);

    function addCard(x, y) {
        const newCardId = crypto.randomUUID();
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
    

    const updateGeometry = useCallback((id, x, y, width, height) => {
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, x, y, width, height }
                    : card
            )
        );
    }, []);

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
        replaceCards,
        addCard,
        updatePosition,
        updateGeometry,
        updateText,
        removeCard
    };
}