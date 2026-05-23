import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "time-is-money",
  name: "Time Is Money",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Sort items fast while the money drains.",
  initialData: { board: ["LOW","MID","HIGH","BANK","DRAIN"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Start Drain",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Stop Drain",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Sort",
      "tone": "blue"
    }
  ]
});
