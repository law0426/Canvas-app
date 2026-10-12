

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


export default function App() {

const {
    cards,
    addCard,
    updatePosition,
    updateText,
    removeCard
  } = useCards();

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

  return (
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
            beginTextManipulation={beginTextManipulation}
            endTextManipulation={endTextManipulation}
          />
        ))}
      </WorldLayer>
    </Canvas>
  );
}