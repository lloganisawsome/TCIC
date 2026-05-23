import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "card-game",
  name: "Card Game",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "cards",
  instruction: "Draw cards to build a bid, then stop before greed gets expensive.",
  initialData: { board: ["A","2","3","4","5","6","7","8","9","10","WILD"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Draw Card",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Stop Bid",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Bid",
      "tone": "blue"
    }
  ]
});
