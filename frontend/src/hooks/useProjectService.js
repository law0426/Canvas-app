import { useCallback, useState } from "react";

export default function useProjectService({ projectId, replaceCards }) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveProject = useCallback(async (cards) => {
        if (!projectId || isSaving) return;

        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${projectId}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: projectId,
                    cards: cards.map(card => ({
                        id: card.id,
                        text: card.text ?? "",
                        tagIds: card.tagIds ?? [],
                        x: card.x,
                        y: card.y,
                        width: card.width ?? 240,
                        height: card.height ?? 180,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Save failed (${response.status})`);
            }

            const project = await response.json();
            replaceCards(project.cards ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    }, [projectId, isSaving, replaceCards]);

    return { saveProject, isSaving, error };
}