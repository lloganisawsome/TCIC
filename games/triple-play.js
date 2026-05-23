import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "triple-play",
  name: "Triple Play",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Survive three targets in a row for the finale.",
  initialData: { board: ["CAR 1","CAR 2","CAR 3","YES","NO"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Play 1",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Play 2",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Triple",
      "tone": "blue"
    }
  ]
});
