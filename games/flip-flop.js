import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "flip-flop",
  name: "Flip Flop",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Choose flip, flop, both, or neither to make the target.",
  initialData: { board: ["FLIP","FLOP","BOTH","NEITHER","12","21"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Flip",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Flop",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal",
      "tone": "blue"
    }
  ]
});
