import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "now-or-then",
  name: "Now Or Then",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Call each item now or then and build a connected chain.",
  initialData: { board: ["NOW","THEN","NOW","THEN","CHAIN","BREAK"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Now",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Then",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Chain",
      "tone": "blue"
    }
  ]
});
