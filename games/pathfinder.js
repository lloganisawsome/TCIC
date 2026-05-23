import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "pathfinder",
  name: "Pathfinder",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Step through the target path on a 3x3 board.",
  initialData: { board: ["1","2","3","4","5","6","7","8","9"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Step",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Backtrack",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Path",
      "tone": "blue"
    }
  ]
});
