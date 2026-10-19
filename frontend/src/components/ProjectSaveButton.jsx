import useProjectService from "../hooks/useProjectService";

export default function ProjectSaveButton({
    projectId,
    cards,
    replaceCards,
    isDirty, 
    activateSavedProject,
}) {
    const { saveProject, isSaving, error } = useProjectService({
        projectId,
        replaceCards,
        activateSavedProject,
        isDirty, 
    });

    return (
        <div
            style={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 10000,
            }}
        >
            <button
                type="button"
                onClick={() => saveProject(cards)}
                disabled={!isDirty || isSaving}
                style={{
                    padding: "10px 18px",
                    cursor: isSaving ? "wait" : "pointer",
                }}
            >
                {isSaving ? "Saving..." : "Save project"}
            </button>

            {error && (
                <p role="alert">
                    Save failed: {error}
                </p>
            )}
        </div>
    );
}