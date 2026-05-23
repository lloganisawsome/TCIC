import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "switcheroo",
  name: "Switcheroo",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Place blocks across several targets before time runs out.",
  initialData: { board: ["BLOCK 1","BLOCK 2","BLOCK 3","BLOCK 4","BLOCK 5"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Place Block",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Check Count",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Blocks",
      "tone": "blue"
    }
  ]
});
