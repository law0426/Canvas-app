// useCards.js

import { useCallback, useState } from "react";

export default function useCards() {
    const [cards, setCards] = useState([]);

    const [isDirty, setIsDirty] = useState(false);

    const markClean = useCallback(() => {
        setIsDirty(false);
    }, []);

    const replaceCards = useCallback((nextCards) => {
        setCards(nextCards);
        setIsDirty(false);
    }, []);

    function addCard(x, y) {
        setIsDirty(true);
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
        setIsDirty(true);
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, x, y }
                    : card
            )
        );
    }
    

    const updateGeometry = useCallback((id, x, y, width, height) => {
        setIsDirty(true);
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, x, y, width, height }
                    : card
            )
        );
    }, []);

    function updateText(id, text) {
        setIsDirty(true);
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, text }
                    : card
            )
        );
    }

    function removeCard(id) {
        setIsDirty(true);
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
        removeCard,
        isDirty,
        markClean,
    };
}