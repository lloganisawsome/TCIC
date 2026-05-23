import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "swap-meet",
  name: "Swap Meet",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Swap prizes until values match.",
  initialData: { board: ["SWAP","KEEP","MATCH","MISS","VALUE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Swap",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Keep",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Match",
      "tone": "blue"
    }
  ]
});
