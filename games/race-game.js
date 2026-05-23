import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "race-game",
  name: "Race Game",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Match targets to prizes before the clock eats the room.",
  initialData: { board: ["PRIZE A","PRIZE B","PRIZE C","PRIZE D","CHECK"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Start Race",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Check Count",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Race",
      "tone": "blue"
    }
  ]
});
