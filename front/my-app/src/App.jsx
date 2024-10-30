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

  // const fetchCards = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:6000/cards");
  //     setCards(response.data);
  //   } catch (error) {
  //     console.error("Error fetching cards:", error);
  //   }
  // };

  const fetchCards = () => {
    axios
      .get("http://localhost:5000/cards")
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
      setColor("");
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
    <div>
      <h1>Card Manager</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: card.color,
              padding: "20px",
              color: "#fff",
              textAlign: "center",
              borderRadius: "8px",
            }}
          >
            <p>{card.text}</p>
            <button onClick={() => editCard(card)}>Edit</button>
            <button onClick={() => deleteCard(card.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
