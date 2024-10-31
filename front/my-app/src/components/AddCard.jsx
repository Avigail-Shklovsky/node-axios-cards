import React from 'react'
import { Icon } from "@iconify/react";
import axios from "axios";


export const AddCard = ({ cards, setCards, text, setText, color, setColor }) => {

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
        <>
            <button
                className="addCard"
                onClick={newCard}
            >
                <Icon
                    className='plus'
                    icon="rivet-icons:plus"
                />
            </button>
        </>
    )
}
