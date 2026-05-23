import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "danger-price",
  name: "Danger Price",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Avoid the danger target and pick the safe prizes.",
  initialData: { board: ["DANGER","SAFE","SAFE","SAFE","TRAP","BONUS"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Mark Danger",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Safe Pick",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Trap",
      "tone": "blue"
    }
  ]
});
