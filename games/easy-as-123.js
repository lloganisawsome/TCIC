import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "easy-as-123",
  name: "Easy as 1 2 3",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Rank the prizes from lowest target to highest target.",
  initialData: { board: ["1","2","3","LOW","MID","HIGH"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Place 1",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Place 2",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Order",
      "tone": "blue"
    }
  ]
});
