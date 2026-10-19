export default function NewProjectButton({
    createProject,
    isCreatingProject,
}) {
    return (
        <button
            type="button"
            onClick={createProject}
            disabled={isCreatingProject}
            style={{
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 10000,
                padding: "10px 18px",
                cursor: isCreatingProject ? "wait" : "pointer",
            }}
        >
            {isCreatingProject ? "Creating..." : "New project"}
        </button>
    );
}