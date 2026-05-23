import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "ten-chances",
  name: "Ten Chances",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Build targets using limited attempts.",
  initialData: { board: ["TRY 1","TRY 2","TRY 3","TRY 4","TRY 5","TRY 10"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Use Chance",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Wrong Buzz",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Chance",
      "tone": "blue"
    }
  ]
});
