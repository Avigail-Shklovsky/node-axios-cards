import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#403d3d");
  const [currentId, setCurrentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setText("");
      setColor("#403d3d");
      setIsModalOpen(false);
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

  const resetState = () => {
    setCurrentId(null);
    setText("");
    setColor("#403d3d");
    setIsEditing(false);
  };


  return (
    <div className="app">
      <h1 className="title">Card Manager</h1>


      {isModalOpen && (
        <div className="modal">

          <div className="modalContent">
            <button className="closeModal" onClick={() => setIsModalOpen(false)}>
              <Icon icon="mingcute:close-fill" className="closeModalIcon" />
            </button>

            <h1 style={{ color: 'white' }}>Add Card:</h1>
            <input className="textAdd"
              type="text"
              placeholder="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="colorDiv">
              <p style={{ color: 'white', fontSize: 'large' }}>Choose background color:</p>

              <input className="colorInput"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <button className="saveCard" onClick={saveCard}>{currentId ? "Update Card" : "Add Card"}</button>

          </div>
        </div>
      )}



      <div className="cardsContainer" >
        {cards.map((card) => (
          <div className="card" key={card.id} style={{ backgroundColor: card.color }}>

            {isEditing && currentId === card.id ? (
              <input className="textUpdate"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleTextBlur}
                autoFocus
              />
            ) : (
              <p className="cardText" onClick={() => handleTextClick(card)}>
                {card.text}
              </p>
            )}

            <div className="buttonsContainer">

              <input
                className="colorUpdate"
                type="color"
                value={card.color}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setColor(newColor);
                  setCards(cards.map((c) => (c.id === card.id ? { ...c, color: newColor } : c)));
                }}
                onBlur={async (e) => {
                  const newColor = e.target.value; // Get the color value on blur
                  await axios.put(`http://localhost:5000/cards/${card.id}`, { text: card.text, color: newColor });
                }}
                style={{ cursor: 'pointer' }}
              />

              <button className="deleteButton" onClick={() => deleteCard(card.id)}>
                <Icon className='icon' icon="tabler:trash" />
              </button>

            </div>

          </div>
        ))}
        <button className="addCard" onClick={() => {
          resetState();
          setIsModalOpen(true);
        }}>
          <Icon className='plus' icon="rivet-icons:plus" />
        </button>
      </div>

    </div>
  );
}

export default App;
