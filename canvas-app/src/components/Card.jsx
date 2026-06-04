import { useState } from "react";
import CardFace from "./CardFace";
import CardBack from "./CardBack";
//import set dragging id. this should probably be from this file, actualy..?
//Id should be a card component element. Another thing that has to be moved.
//eventtoworld, that's from utils coordinates.
//


//External variable to manage data for multiples of cards.
//Q: is it considered general if it applies to multiples, but of the same type?

/*
const [cards, setCards] = useState([
    { id: 1, x: 100, y: 100, text: "Edit me" },
  ]);


*/



export default function Card({
  card,
  //cards,
  camera,
  setDraggingId,
  offset,
  eventToWorld,
  updateText,
  addCard
}) {



  const [flipped, setFlipped] = useState(true);
    /*
    cards:
    Stores every card on the canvas.

    Each card has:
    - id      -> unique identifier
    - x, y    -> world position on canvas
    - text    -> editable content

    useState causes React to re-render whenever cards change.
  */
  
  

  function startDrag(e) {
    if (e.button !== 0) return;

    setDraggingId(card.id);

    const mouse = eventToWorld(e, camera);

    offset.current = {
      x: mouse.x - card.x,
      y: mouse.y - card.y,
    };

    e.stopPropagation();
  }

  
    /*
      addCard()
  
      Called when:
      - clicking empty canvas space
  
      Purpose:
      - create a new card
  
      Why convert coordinates:
      - click position is screen-space
      - cards exist in world-space
  
      Why target check:
      - prevents creating cards when clicking existing cards
    */
  function addCard(e) {
    if (e.target !== e.currentTarget) return;
  
    // Convert click position into world-space
    const world = eventToWorld(e, camera);
    //TODO: Figure this out. I need AI to explain this to me, very clearly.
    setCards((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: world.x,
        y: world.y,
        text: "New card",
  
        tagIds: [
          "philosophy",
          "ai",
          "science",
          "art",
        ],
      },
    ]);
  }

  return (
    
    <div
      //cards = {cards}
      onMouseDown={(e) => startDrag(e, card)}
      
      style={{
        pointerEvents: "auto",

        position: "absolute",
        // Render world-space card position relative to camera
        left: card.x,
        top: card.y,
        transform: "translate(-50%, -50%)",

        minWidth: 120,
        minHeight: 60,
        padding: 8,

        background: "#fff",
        cursor: "move",
      }}
    >
      {flipped ? (
        <CardBack card={card} />
      ) : (
        <CardFace
          card={card}
          updateText={updateText}
        />
      )}
    </div>
  );
}