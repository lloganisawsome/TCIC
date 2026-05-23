import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "secret-x",
  name: "Secret X",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Place Xs and reveal whether the secret X completes a line.",
  initialData: { board: ["X","?","X","?","SECRET","LINE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Place X",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Secret Reveal",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Score Line",
      "tone": "blue"
    }
  ]
});
