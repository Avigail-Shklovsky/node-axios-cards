import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cards, setCards] = useState([]);
  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const [currentId, setCurrentId] = useState(null);

  // Fetch all cards
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:6000/cards");
      setCards(response.data);
      console.log(cards);
      
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // Create a new card
  const createCard = async () => {
    try {
      const response = await axios.post("http://localhost:6000/cards", { text, color });
      setCards([...cards, response.data]);
      setText("");
      setColor("");
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  // Update an existing card
  const updateCard = async (id) => {
    try {
      const response = await axios.put(`http://localhost:6000/cards/${id}`, { text, color });
      setCards(cards.map((card) => (card.id === id ? response.data : card)));
      setText("");
      setColor("");
      setCurrentId(null);
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  // Delete a card
  const deleteCard = async (id) => {
    try {
      await axios.delete(`http://localhost:6000/cards/${id}`);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      updateCard(currentId);
    } else {
      createCard();
    }
  };

  // Set card for editing
  const editCard = (card) => {
    setCurrentId(card.id);
    setText(card.text);
    setColor(card.color);
  };

  return (
    <div>
      <h1>Card Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button type="submit">{currentId ? "Update Card" : "Add Card"}</button>
      </form>

      <ul>
        {cards.map((card) => (
          <li key={card.id} style={{ color: card.color }}>
            {card.text} ({card.color})
            <button onClick={() => editCard(card)}>Edit</button>
            <button onClick={() => deleteCard(card.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
