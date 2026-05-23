import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "five-price-tags",
  name: "Five Price Tags",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Choose the one correct target from five loud decoys.",
  initialData: { board: ["$99","$149","$249","$399","$599","TRUE","FALSE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Tag True",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Tag False",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Tag",
      "tone": "blue"
    }
  ]
});
