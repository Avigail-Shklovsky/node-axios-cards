import React, { useState, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import './App.css'

function App() {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [currentId, setCurrentId] = useState(null);

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
      setColor("#000000");
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

  // Set card for editing
  const editCard = (card) => {
    setCurrentId(card.id);
    setText(card.text);
    setColor(card.color);
  };

  return (
    <div className="app">
      <h1 className="title">Card Manager</h1>

      <div className="input" >
        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={saveCard}>{currentId ? "Update Card" : "Add Card"}</button>
      </div>

      <div className="cardsContainer" >
        {cards.map((card) => (
          <div className="card"
            key={card.id}
            style={{ backgroundColor: card.color }}
          >
            <p className="cardText">{card.text}</p>
            <div className="buttonsContainer">
              <button className="cardButtons" onClick={() => editCard(card)}>
                <Icon className='icon'icon="tabler:edit" />
              </button>
              <button className="cardButtons" onClick={() => deleteCard(card.id)}>
                <Icon className='icon' icon="tabler:trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
