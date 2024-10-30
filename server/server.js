const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // a library to generate unique id

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
const port = 5000;

const cards = [
  { id: "1", text: "hello", color: "#E69138" },
  { id: "2", text: "world", color: "#6AA84F" },
  { id: "3", text: "good afternoon", color: "#A4C2F4" },
];

// middleware
app.use(express.json());

// CRUD

//  GET all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// get card by id
app.get("/cards/:id", (req, res) => {
  const card = cards.find((b) => b.id === parseInt(req.params.id));
  if (!card) return res.status(404).send("card not found");
  res.json(card);
});

// create a new card
app.post("/cards", (req, res) => {
  const newCard = {
    id: uuidv4(),
    text: req.body.text,
    color: req.body.color,
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// update card
app.put("/cards/:id", (req, res) => {
  const card = cards.find((c) => c.id === req.params.id);
  if (!card) return res.status(404).send("card not found");
  card.text = req.body.text;
  card.color = req.body.color;
  res.json(card);
});

// delete card
app.delete("/cards/:id", (req, res) => {
  const cardIndex = cards.findIndex((c) => c.id === req.params.id);
  if (cardIndex === -1) return res.status(404).send("card not found");

  const updatedcards = cards.splice(cardIndex, 1);
  res.json(updatedcards);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
