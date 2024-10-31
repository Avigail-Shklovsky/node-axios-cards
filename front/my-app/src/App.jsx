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



  return (
    <div className="app">
      <h1 className="title">Card Manager</h1>
      <div className="cardsContainer" >
        {cards.map((card, index) => (
          <Card
            cards={cards}
            setCards={setCards}
            card={card}
            index={index}
            currentId={currentId}
            setCurrentId={setCurrentId}
            text={text}
            setText={setText}
            color={color}
            setColor={setColor}
          >
          </Card>
        ))}
        <AddCard
          cards={cards}
          setCards={setCards}
          color={color}
          setColor={setColor}
          text={text}
          setText={setText}
        ></AddCard>
      </div>
    </div>
  );
}

export default App;
