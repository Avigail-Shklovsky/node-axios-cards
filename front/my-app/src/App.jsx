import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState("Enter text here");
  const [color, setColor] = useState("#403d3d");
  const [currentId, setCurrentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Fetch all cards
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    axios.get("http://localhost:5000/cards")
      .then((response) => {
        setCards(response.data);
        console.log(response.data);
      })
      .catch((e) => console.error(e.message));
  };

  // Create or update a card
  const saveCard = async () => {
    try {
      if (currentId) {
        // Update card
        const response = await axios.put(`http://localhost:5000/cards/${currentId}`, { text, color });
        setCards(cards.map((card) => (card.id === currentId ? response.data : card)));
        setCurrentId(null);
      } else {
        // Create new card
        const response = await axios.post("http://localhost:5000/cards", { text, color });
        setCards([...cards, response.data]);
      }
      setText("Enter text here");
      setColor("#403d3d");
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  // Delete a card
  const deleteCard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cards/${id}`);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleTextClick = (card) => {
    setCurrentId(card.id);
    setColor(card.color)
    setText(card.text);
    setIsEditing(true);
  };

  const handleTextBlur = async () => {
    if (currentId) {
      await saveCard();
    }
    setIsEditing(false);
  };

  const handleColorChange = function (e, card) {
    const newColor = e.target.value;
    setColor(newColor);
    setCards(cards.map(function (c) {
      return c.id === card.id ? { ...c, color: newColor } : c;
    }));
  };

  const handleColorBlur = async function (e, card) {
    const newColor = e.target.value;
    await axios.put(`http://localhost:5000/cards/${card.id}`, { text: card.text, color: newColor });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = async (index) => {
    if (draggedIndex === null) return;
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(index, 0, movedCard);
    const response = await axios.put("http://localhost:5000/cards", updatedCards);
    setCards(response.data);
    setDraggedIndex(null);
  };


  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const newCard = async () => {
    try {
      const response = await axios.post("http://localhost:5000/cards", { text, color });
      setCards([...cards, response.data]);
      setText("Enter text here");
      setColor("#403d3d");

    }
    catch (error) {
      console.error("Error saving card:", error);
    }

  }

  return (
    <div className="app">
      <h1 className="title">Card Manager</h1>
      <div className="cardsContainer" >
        {cards.map((card, index) => (
          <div
            className="card"
            key={card.id}
            style={{ backgroundColor: card.color }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            {isEditing && currentId === card.id ? (
              <input
                className="textUpdate"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
              />
            ) : (
              <p
                className="cardText"
                onClick={() => handleTextClick(card)}
              >
                {card.text}
              </p>
            )}

            <div className="buttonsContainer">

              <input // color input to update
                className="colorUpdate"
                type="color"
                value={card.color}
                onChange={(e) => handleColorChange(e, card)}
                onBlur={(e) => handleColorBlur(e, card)}
              />

              <button
                className="deleteButton"
                onClick={() => deleteCard(card.id)}
              >
                <Icon
                  className='icon'
                  icon="tabler:trash"
                />
              </button>

            </div>
          </div>
        ))}
        <button
          className="addCard"
          onClick={newCard}
        >
          <Icon
            className='plus'
            icon="rivet-icons:plus"
          />
        </button>
      </div>

    </div>
  );
}

export default App;
