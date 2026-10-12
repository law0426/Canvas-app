import { useState, useRef, useEffect } from "react";
import {
  screenToWorld,
  eventToWorld
} from "./utils/coordinates";
import Card from "./components/Card";
import useCards from "./hooks/useCards";
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
// we technically have another variable that we're not using: Tags[].
// create an array, using set cards, and usestate... useState just initializes, accepting the initial argument.

  const [activeCardId, setActiveCardId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTextManipulating, setIsTextManipulating] = useState(false);

  const {
    camera,
    setCamera,
    zoom,
    resetCamera,
  } = useCamera();

  


  /*
    offset is used during dragging.

    Example:
    If you click the middle of a card,
    we don't want the card's top-left corner
    to suddenly snap to the mouse position.

    So we store:
    mouse position relative to card position

    useRef is used instead of useState because:
    - changing it should NOT trigger re-renders
    - it updates very frequently during dragging
  */
  const offset = useRef({ x: 0, y: 0 });


  /*
    panning:
    Tracks whether middle mouse panning is active.

    Stored in useRef because:
    - it changes often
    - no UI needs to re-render because of it
  */
  const panning = useRef(false);


  /*
    panStart:
    Stores where panning began.

    Used to calculate:
    how far the camera should move.
  */
  const panStart = useRef({ x: 0, y: 0 });


  


  /*
    startPan()

    Called when:
    - middle mouse button pressed on canvas

    Purpose:
    - begin moving the camera

    Why middle mouse:
    - avoids conflict with:
      - card dragging
      - text selection/editing
  */
  function startPan(e) {
    if (e.button !== 1) return;

    // Prevent canvas from stealing focus
    e.preventDefault();

    panning.current = true;

    panStart.current = {
      x: e.clientX - camera.x,
      y: e.clientY - camera.y,
    };
  }


  /*
    onMove()

    Called continuously during mouse movement.

    Handles:
    - dragging cards
    - panning camera

    This function acts like the app's
    central "interaction loop".
  */
  function onMove(e) {

    /*
      CARD DRAGGING
    */
    if (isDragging) {
      const mouse = eventToWorld(e, camera);

      updatePosition(
        activeCardId,
        mouse.x - offset.current.x,
        mouse.y - offset.current.y
      );
    }


    /*
      CAMERA PANNING
    */
    if (panning.current) {

      setCamera((prev) => ({
        ...prev,

        /*
          Move camera relative to where panning started.
        */
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      }));
    }
  }


  /*
    stopAll()

    Called when:
    - mouse button released

    Purpose:
    - stop dragging
    - stop panning

    Resets interaction state.
  */
  function stopAll() {
    // Dragging has ended, but the card remains active/selected.
    setIsDragging(false);
    panning.current = false;
}


  /*
    onWheel()

    Called when:
    - mouse wheel scrolls

    Purpose:
    - zoom camera in/out

    deltaY:
    - positive = scroll down
    - negative = scroll up

    Why clamp zoom:
    - prevents infinite zoom in/out
  */
  function onWheel(e) {
  //e.preventDefault();
    zoom();
}





  useEffect(() => {
  function handleKeyDown(e) {

    // Ignore typing inside editable cards
    if (e.target.isContentEditable) return;
    //Call reset camera
    if (e.code === "Space") {
      e.preventDefault();
      resetCamera();
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("mouseup", stopAll);
  //if returning, do this?
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mouseup", stopAll);
    };
  }, []);

  return (
    <Canvas
      camera={camera}
      onMove={onMove}
      stopAll={stopAll}
      startPan={startPan}
      onWheel={zoom}
      addCard={addCard}
      setActiveCardId={setActiveCardId}
    >
      <WorldLayer camera={camera}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            camera={camera}
            updateText={updateText}
            setActiveCardId={setActiveCardId}
            activeCardId={activeCardId}
            setIsDragging={setIsDragging}
            offset={offset}
            eventToWorld={eventToWorld}
            removeCard={removeCard}
          />
        ))}
      </WorldLayer>
    </Canvas>
  );
}