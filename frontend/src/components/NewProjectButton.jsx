export default function NewProjectButton({
    startNewProject,
    isStartingNewProject,
    resetCamera,
}) {
    async function handleClick() {
        const success = await startNewProject();

        if (success) resetCamera();
    }
    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isStartingNewProject}
            style={{
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 10000,
                padding: "10px 18px",
                cursor: isStartingNewProject ? "wait" : "pointer",
            }}
        >
            {isStartingNewProject ? "Starting..." : "New project"}
        </button>
    );
}