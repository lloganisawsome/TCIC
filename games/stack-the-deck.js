import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "stack-the-deck",
  name: "Stack The Deck",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "cards",
  instruction: "Earn useful cards, fill target positions, and lock the answer.",
  initialData: { board: ["A","K","Q","J","10","WILD","DIGIT"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Flip Card",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Place Digit",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Deck",
      "tone": "blue"
    }
  ]
});
