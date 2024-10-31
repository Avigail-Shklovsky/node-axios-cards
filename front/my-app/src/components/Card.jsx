import { useState } from 'react'
import axios from "axios";
import '../App.css'
import { TextInput } from "./TextInput";
import { ColorInput } from './ColorInput';
import { Icon } from "@iconify/react";


export const Card = ({ cards, card, index, setCards,
    currentId, setCurrentId, text, setText,
    color, setColor }) => {

    const [draggedIndex, setDraggedIndex] = useState(null);

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
        const response = await axios.put("http://localhost:5000/cards", updatedCards);
        setCards(response.data);
        setDraggedIndex(null);
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


    return (
        <>
            <div
                className="card"
                key={card.id}
                style={{ backgroundColor: card.color }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
            >
                <TextInput
                    card={card}
                    currentId={currentId}
                    setCurrentId={setCurrentId}
                    text={text}
                    setText={setText}
                    saveCard={saveCard}
                    color={color}
                    setColor={setColor}
                ></TextInput>
                <div className="buttonsContainer">

                    <ColorInput
                        card={card}
                        setColor={setColor}
                        cards={cards}
                        setCards={setCards}
                    ></ColorInput>
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
        </>
    )
}
