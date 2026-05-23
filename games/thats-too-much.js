import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "thats-too-much",
  name: "That's Too Much",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Stop the climbing targets at exactly the right moment.",
  initialData: { board: ["$18K","$21K","$24K","$27K","$30K","TOO MUCH"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Next Price",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Too Much",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Stop",
      "tone": "blue"
    }
  ]
});
