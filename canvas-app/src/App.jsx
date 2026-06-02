import { useState, useRef, useEffect } from "react";
import {
  screenToWorld,
  eventToWorld
} from "./utils/coordinates";
import Card from "./components/Card";
import CardFace from "./components/CardFace";
import CardBack from "./components/CardBack";
import Canvas from "./components/Canvas";
import {
  useCamera
} from "./utils/camera"
import WorldLayer from "./components/WorldLayer";


export default function App() {





  /*
    draggingId:
    Tracks which card is currently being dragged.

    null means:
    - no card is being dragged

    otherwise:
    - stores the id of the active card
  */
  const [draggingId, setDraggingId] = useState(null);


  /*
    camera:
    Represents the user's viewport into the world.

    x, y:
    - controls panning

    zoom:
    - controls scaling

    This is NOT changing the card positions themselves.
    It only changes how the world is viewed.
  */
  // const [camera, setCamera] = useState({
  //   x: 0,
  //   y: 0,
  //   zoom: 1,
  // });
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
    startDrag()

    Called when:
    - user presses left mouse button on a card

    Purpose:
    - begin dragging a card
    - calculate drag offset

    Why e.button === 0:
    - 0 = left click
    - prevents middle click from dragging cards

    Why stopPropagation():
    - prevents card dragging from also triggering canvas panning
  */
  // function startDrag(e, card) {
  //   if (e.button !== 0) return;

  //   setDraggingId(card.id);

  //   // Convert cursor from screen-space into world-space
  //   const mouse = eventToWorld(e, camera);

  //   offset.current = {
  //     x: mouse.x - card.x,
  //     y: mouse.y - card.y,
  //   };

  //   e.stopPropagation();
  // }


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
    if (draggingId !== null) {

      // Current cursor position in world-space
      const mouse = eventToWorld(e, camera);
      setCards((prev) =>
        prev.map((c) =>
          c.id === draggingId
            ? {
                ...c,

                /*
                  Mouse coordinates are screen-space.

                  Card positions are world-space.

                  So we convert screen -> world coordinates
                  using camera transform math.
                */
                x: mouse.x - offset.current.x,
                y: mouse.y - offset.current.y,
              }
            : c
        )
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
    setDraggingId(null);
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

  // //This part is now taken care of in camera.js
  // const zoomFactor = 1.2;

  // const newZoom =
  //   e.deltaY < 0
  //     ? camera.zoom * zoomFactor
  //     : camera.zoom / zoomFactor;

  // const clampedZoom = Math.min(3, Math.max(0.2, newZoom));

  // // Mouse position relative to viewport
  // const mouseX = e.clientX;
  // const mouseY = e.clientY;

  // // Convert mouse position into world coordinates BEFORE zoom
  // const worldX = (mouseX - camera.x) / camera.zoom;
  // const worldY = (mouseY - camera.y) / camera.zoom;

  // // Recalculate camera position so cursor stays anchored
  // const newCameraX = mouseX - worldX * clampedZoom;
  // const newCameraY = mouseY - worldY * clampedZoom;

  // setCamera({
  //   x: newCameraX,
  //   y: newCameraY,
  //   zoom: clampedZoom,
  // });
}

function addCard(e){
  card.addCard(e);
}

  /*
    updateText()

    Called when:
    - card loses focus after editing

    Purpose:
    - save edited text into React state

    Why onBlur instead of onInput:
    - contentEditable conflicts with React re-rendering
    - updating every keystroke breaks cursor behavior
  */
  function updateText(id, text) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c))
    );
  }









/*
    RENDER

    Outer div:
    - viewport container
    - handles global mouse events

    Inner div:
    - actual world/canvas
    - transformed by camera
  */

    //REPLACE WITH camera.resetCamera();
  // function resetCamera() {
  //   setCamera({
  //     x: 0,
  //     y: 0,
  //     zoom: 1,
  //   });
  // }

  
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
    >
      <WorldLayer camera={camera}>
        {card.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            camera={camera}
            startDrag={card.startDrag}
            updateText={updateText}
          />
        ))}
      </WorldLayer>
    </Canvas>
  );
}