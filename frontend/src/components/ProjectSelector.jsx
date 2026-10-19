import { useEffect, useState } from "react";

export default function ProjectSelector({ loadProject, isLoading }) {
    const [projects, setProjects] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(null);

    async function refreshProjects() {
        try {
            const response = await fetch("/api/projects");

            if (!response.ok) {
                throw new Error(`Loading projects failed: ${response.status}`);
            }

            setProjects(await response.json());
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        refreshProjects();
    }, []);

    async function handleLoad() {
        if (selectedId) {
            await loadProject(selectedId);
        }
    }

    return (
        <div style={{
            position: "fixed",
            top: 16,
            left: 150,
            zIndex: 10000,
            display: "flex",
            gap: 6,
        }}>
            <select
                aria-label="Select project"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={isLoading}
            >
                <option value="">Select project...</option>
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.id.slice(0, 8)} —{" "}
                        {new Date(project.savedAtUtc).toLocaleString()}
                    </option>
                ))}
            </select>

            <button
                type="button"
                onClick={handleLoad}
                disabled={!selectedId || isLoading}
            >
                Load
            </button>

            <button type="button" onClick={refreshProjects}>
                Refresh
            </button>

            {error && <span role="alert">{error}</span>}
        </div>
    );
}
