import { useCallback, useState } from "react";

export default function useProjectService({
    projectId,
    replaceCards,
    activateSavedProject,
    isDirty,
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const saveProject = useCallback(async (cards) => {
        if (!isDirty || isSaving) return;

        const isDraft = !projectId;
        const endpoint = isDraft
            ? "/api/projects/draft/save"
            : `/api/projects/${projectId}/save`;

        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: projectId ?? "00000000-0000-0000-0000-000000000000",
                    cards: cards.map(card => ({
                        id: card.id,
                        frontContent: card.frontContent ?? {
                            type: "doc",
                            content: [{ type: "paragraph" }],
                        },
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

            if (isDraft) {
                activateSavedProject(project);
            } else {
                replaceCards(project.cards ?? []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    }, [
        projectId,
        isDirty,
        isSaving,
        replaceCards,
        activateSavedProject,
    ]);

    return { saveProject, isSaving, error };
}