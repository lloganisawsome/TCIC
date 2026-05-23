import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "push-over",
  name: "Push Over",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Push blocks until the correct target window appears.",
  initialData: { board: ["1","2","3","4","5","6","7","8","9"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Push Left",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Push Right",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Window",
      "tone": "blue"
    }
  ]
});
