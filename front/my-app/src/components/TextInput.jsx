import React, { useState } from "react";
import '../App.css'

export const TextInput = ({ card, currentId, setCurrentId, text,
    setText, saveCard, color, setColor }) => {
    const [isEditing, setIsEditing] = useState(false);

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
    return (
        <>
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

        </>
    )
}
