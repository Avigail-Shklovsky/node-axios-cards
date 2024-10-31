import React from 'react'
import axios from "axios";

export const ColorInput = ({card,setColor,cards,setCards}) => {
 
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
    return (
    <>
             <input // color input to update
                  className="colorUpdate"
                  type="color"
                  value={card.color}
                  onChange={(e) => handleColorChange(e, card)}
                  onBlur={(e) => handleColorBlur(e, card)}
                />
    </>
  )
}
