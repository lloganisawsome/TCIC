import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "shell-game",
  name: "Shell Game",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Earn shells, pick one, and find the hidden ball.",
  initialData: { board: ["SHELL 1","SHELL 2","SHELL 3","SHELL 4","BALL"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Move Ball",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Pick Shell",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Shell",
      "tone": "blue"
    }
  ]
});
