import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "hole-in-one",
  name: "Hole In One",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Order items to earn the best putt, then take the final shot.",
  initialData: { board: ["TEE 1","TEE 2","TEE 3","PUTT","HOLE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Move Tee",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Take Putt",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Putt",
      "tone": "blue"
    }
  ]
});
