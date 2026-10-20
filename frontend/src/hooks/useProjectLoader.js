import { useCallback, useEffect, useRef, useState } from "react";

const PROJECT_ID_KEY = "knowtable.projectId";

export default function useProjectLoader(replaceCards) {
    const [projectId, setProjectId] = useState(
        () => localStorage.getItem(PROJECT_ID_KEY)
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingNewProject, setIsStartingNewProject] = useState(false);
    const [error, setError] = useState(null);
    const started = useRef(false);

    const fetchDraft = useCallback(async () => {
        const response = await fetch("/api/projects/draft");

        if (!response.ok) {
            throw new Error(`Loading draft failed: ${response.status}`);
        }

        const draft = await response.json();

        return {
            ...draft,
            cards: (draft.cards ?? []).map((card) => ({
                ...card,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            })),
        };
    }, []);

    const startNewProject = useCallback(async () => {
        setIsStartingNewProject(true);
        setError(null);

        try {
            const draft = await fetchDraft();

            localStorage.removeItem(PROJECT_ID_KEY);
            setProjectId(null);
            replaceCards(draft.cards ?? []);

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsStartingNewProject(false);
        }
    }, [fetchDraft, replaceCards]);

    const loadProject = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/projects/${id}`);

            if (!response.ok) {
                throw new Error(`Loading project failed: ${response.status}`);
            }

            const project = await response.json();

            localStorage.setItem(PROJECT_ID_KEY, project.id);
            setProjectId(project.id);
            replaceCards(project.cards ?? []);

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [replaceCards]);

    const activateSavedProject = useCallback((project) => {
        localStorage.setItem(PROJECT_ID_KEY, project.id);
        setProjectId(project.id);
        replaceCards(project.cards ?? []);
    }, [replaceCards]);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        async function initializeProject() {
            try {
                const id = localStorage.getItem(PROJECT_ID_KEY);

                if (id) {
                    const response = await fetch(`/api/projects/${id}`);

                    if (response.ok) {
                        const project = await response.json();

                        setProjectId(project.id);
                        replaceCards(project.cards ?? []);
                        return;
                    }

                    if (response.status !== 404) {
                        throw new Error(
                            `Loading project failed: ${response.status}`
                        );
                    }

                    localStorage.removeItem(PROJECT_ID_KEY);
                }

                const draft = await fetchDraft();

                setProjectId(null);
                replaceCards(draft.cards ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        initializeProject();
    }, [fetchDraft, replaceCards]);

    return {
        projectId,
        isLoading,
        isStartingNewProject,
        error,
        startNewProject,
        loadProject,
        activateSavedProject, 
    };
}