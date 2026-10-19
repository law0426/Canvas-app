import { useCallback, useEffect, useRef, useState } from "react";

const PROJECT_ID_KEY = "knowtable.projectId";

export default function useProjectLoader(replaceCards) {
    const [projectId, setProjectId] = useState(
        () => localStorage.getItem(PROJECT_ID_KEY)
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [error, setError] = useState(null);
    const started = useRef(false);

    const createProject = useCallback(async () => {
        setIsCreatingProject(true);
        setError(null);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error(`Creating project failed: ${response.status}`);
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
            setIsCreatingProject(false);
        }
    }, [replaceCards]);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        async function initializeProject() {
            try {
                let id = localStorage.getItem(PROJECT_ID_KEY);

                if (id) {
                    const response = await fetch(`/api/projects/${id}`);

                    if (response.status === 404) {
                        localStorage.removeItem(PROJECT_ID_KEY);
                        id = null;
                    } else if (!response.ok) {
                        throw new Error(`Loading project failed: ${response.status}`);
                    } else {
                        const project = await response.json();

                        setProjectId(project.id);
                        replaceCards(project.cards ?? []);
                        return;
                    }
                }

                await createProject();
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        initializeProject();
    }, [replaceCards, createProject]);

    return {
        projectId,
        isLoading,
        isCreatingProject,
        error,
        createProject,
    };
}