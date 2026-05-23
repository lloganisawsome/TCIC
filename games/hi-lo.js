import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "hi-lo",
  name: "Hi Lo",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Sort items into high and low groups around the hidden divider.",
  initialData: { board: ["HIGH","HIGH","HIGH","LOW","LOW","LOW"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Send High",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Send Low",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Divider",
      "tone": "blue"
    }
  ]
});
