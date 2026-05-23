import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "spelling-bee",
  name: "Spelling Bee",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "cards",
  instruction: "Collect cards and spell the target word.",
  initialData: { board: ["C","A","R","WILD","CARD","BUZZ"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Draw Card",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Keep Card",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Word",
      "tone": "blue"
    }
  ]
});
