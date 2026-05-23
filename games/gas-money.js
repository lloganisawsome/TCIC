import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "gas-money",
  name: "Gas Money",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Pick wrong targets for cash and avoid the actual answer.",
  initialData: { board: ["$18K","$21K","$24K","$27K","$30K","PINK SLIP"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Cash Pick",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Car Pick",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal",
      "tone": "blue"
    }
  ]
});
