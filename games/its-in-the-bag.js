import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "its-in-the-bag",
  name: "It's In The Bag",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Match items to bag values and decide when to stop risking it.",
  initialData: { board: ["$1K BAG","$2K BAG","$4K BAG","$8K BAG","$16K BAG"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Bag Match",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Cash Out",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Bag",
      "tone": "blue"
    }
  ]
});
