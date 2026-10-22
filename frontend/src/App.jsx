

import { eventToWorld } from "./utils/coordinates";
import useWorkspaceInteraction from "./hooks/useWorkspaceInteraction";
import Card from "./components/Card";
import useCards from "./hooks/useCards";
import useCardService from "./hooks/useCardService";
import useAppState from "./hooks/useAppState";
import CardFace from "./components/CardFace";
import CardBack from "./components/CardBack";
import Canvas from "./components/Canvas";
import {
  useCamera
} from "./utils/camera"
import WorldLayer from "./components/WorldLayer";
import useProjectLoader from "./hooks/useProjectLoader";
import ProjectSaveButton from "./components/ProjectSaveButton";
import NewProjectButton from "./components/NewProjectButton";
import ProjectSelector from "./components/ProjectSelector";




export default function App() {

  const {
    cards,
    replaceCards,
    isDirty,
    addCard,
    updatePosition,
    updateGeometry,
    updateText,
    removeCard
  } = useCards();

  const {
    projectId,
    isLoading,
    error,
    startNewProject,
    isStartingNewProject,
    loadProject,
    activateSavedProject,
  } = useProjectLoader(replaceCards);

  const {
    activeCardId,
    recentCardIds,
    isTextManipulating,
    selectCard,
    beginTextManipulation, 
    endTextManipulation,    
    handleCardDeleted,
    registerCardEditor,
  } = useAppState();

  const { deleteCard } = useCardService({
    removeCard,
    handleCardDeleted,
  });

  const {
    camera,
    setCamera,
    zoom,
    resetCamera,
  } = useCamera();

  const {
    setIsDragging,
    offset,
    startPan,
    onMove,
    stopAll,
  } = useWorkspaceInteraction({
    cards,
    activeCardId,
    recentCardIds,
    isTextManipulating,
    camera,
    setCamera,
    resetCamera,
    updatePosition,
  });

  if (isLoading) return <p>Loading project...</p>;

  if (error) {
    return <p role="alert">Failed to load project: {error}</p>;
  }

    return (
    <>
      <Canvas
        camera={camera}
        onMove={onMove}
        stopAll={stopAll}
        startPan={startPan}
        onWheel={zoom}
        addCard={addCard}
        setActiveCardId={selectCard}
      >
        <WorldLayer camera={camera}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              camera={camera}
              updateText={updateText}
              setActiveCardId={selectCard}
              activeCardId={activeCardId}
              registerCardEditor={registerCardEditor}
              setIsDragging={setIsDragging}
              offset={offset}
              eventToWorld={eventToWorld}
              removeCard={deleteCard}
              updateGeometry={updateGeometry}
              isTextManipulating={isTextManipulating}
              beginTextManipulation={beginTextManipulation}
              endTextManipulation={endTextManipulation}
            />
          ))}
        </WorldLayer>
      </Canvas>

      <ProjectSelector
        loadProject={loadProject}
        isLoading={isLoading}
      />

      <NewProjectButton
        startNewProject={startNewProject}
        isStartingNewProject={isStartingNewProject}
      />

      <NewProjectButton
        startNewProject={startNewProject}
        isStartingNewProject={isStartingNewProject}
        resetCamera={resetCamera}
      />

      <ProjectSaveButton
        projectId={projectId}
        cards={cards}
        replaceCards={replaceCards}
        isDirty={isDirty}
        activateSavedProject={activateSavedProject}
      />
    </>
  );
}