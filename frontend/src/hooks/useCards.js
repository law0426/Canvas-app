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

        const newCard = {
            id: newCardId,
            x,
            y,
            frontContent: {
                type: "doc",
                content: [{
                    type: "paragraph",
                    content: [{ type: "text", text: "New card" }]
                }]
            },
            tagIds: ["philosophy", "ai", "science", "art"]
        };

        console.log("Created card:", newCard);

        setCards(prev => [...prev, newCard]);
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

        function updateText(id, frontContent) {
        setIsDirty(true);
        setCards(prev =>
            prev.map(card =>
                card.id === id
                    ? { ...card, frontContent }
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