

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
    createProject,
    isCreatingProject,
    loadProject,
  } = useProjectLoader(replaceCards);

  const {
    activeCardId,
    recentCardIds,
    isTextManipulating,
    selectCard,
    beginTextManipulation, 
    endTextManipulation,    
    handleCardDeleted,
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
        createProject={createProject}
        isCreatingProject={isCreatingProject}
      />
      
      <NewProjectButton
        createProject={createProject}
        isCreatingProject={isCreatingProject}
      />

      <ProjectSaveButton
        projectId={projectId}
        cards={cards}
        replaceCards={replaceCards}
      />
    </>
  );
}