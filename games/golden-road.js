import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "golden-road",
  name: "Golden Road",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Advance through targets from tiny prize to ridiculous finale.",
  initialData: { board: ["SNACK","GADGET","TRIP","CAR","MANSION"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Step Forward",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Mega Prize",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Road",
      "tone": "blue"
    }
  ]
});
