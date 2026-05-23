import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "pass-the-buck",
  name: "Pass The Buck",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Move the buck, reveal spaces, and dodge lose-everything.",
  initialData: { board: ["CAR","LOSE","CASH","CASH","PICK","BUCK"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Pass Buck",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Pick Space",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Space",
      "tone": "blue"
    }
  ]
});
