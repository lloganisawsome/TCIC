import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "temptation",
  name: "Temptation",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Use gift clues to build the final target, then risk or bail.",
  initialData: { board: ["GIFT 1","GIFT 2","GIFT 3","GIFT 4","TEMPT"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Take Gift",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Change Digit",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Car",
      "tone": "blue"
    }
  ]
});
