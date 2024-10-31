import React from 'react';
import { TextInput } from "./TextInput";
import { ColorInput } from './ColorInput';
import { Icon } from "@iconify/react";
import axios from 'axios';

export const Card = ({ cards, setCards, card, index,
    currentId, setCurrentId, text, setText, color,
    setColor, onDragStart, onDragOver, onDrop }) => {

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
        <div
            className="card"
            style={{ backgroundColor: card.color }}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <TextInput
                card={card}
                currentId={currentId}
                setCurrentId={setCurrentId}
                text={text}
                setText={setText}
                color={color}
                setColor={setColor}
                saveCard={saveCard}
            />
            <div className="buttonsContainer">
                <ColorInput
                    card={card}
                    setColor={setColor}
                    cards={cards}
                    setCards={setCards}
                />
                <button className="deleteButton" onClick={() => deleteCard(card.id)}>
                    <Icon className='icon' icon="tabler:trash" />
                </button>
            </div>
        </div>
    );
};
