import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "./components/Card";
import './App.css'
import { AddCard } from "./components/AddCard";

function App() {
  const [cards, setCards] = useState([]);
  const [color, setColor] = useState("#403d3d");
  const [currentId, setCurrentId] = useState(null);
  const [text, setText] = useState("Enter text here");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Fetch all cards
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    axios.get("http://localhost:5000/cards")
      .then((response) => {
        setCards(response.data);
      })
      .catch((e) => console.error(e.message));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (index) => {
    if (draggedIndex === null) return;

    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(index, 0, movedCard);

    try {
      const response = await axios.put("http://localhost:5000/cards", updatedCards);
      setCards(response.data);
    } catch (error) {
      console.error("Error updating cards:", error);
    }

    setDraggedIndex(null); // Reset dragged index after drop
  };

  return (
    <div className="app">
      <h1 className="title">Card Manager</h1>
      <div className="cardsContainer">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            cards={cards}
            setCards={setCards}
            currentId={currentId}
            setCurrentId={setCurrentId}
            text={text}
            setText={setText}
            color={color}
            setColor={setColor}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          />
        ))}
        <AddCard
          cards={cards}
          setCards={setCards}
          color={color}
          setColor={setColor}
          text={text}
          setText={setText}
        />
      </div>
    </div>
  );
}

export default App;
