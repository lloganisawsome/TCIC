import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "pick-a-pair",
  name: "Pick A Pair",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Find two items with matching targets.",
  initialData: { board: ["PAIR A","PAIR B","MATCH","MISS","SWAP"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Pick First",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Pick Pair",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Pair",
      "tone": "blue"
    }
  ]
});
