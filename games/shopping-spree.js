import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "shopping-spree",
  name: "Shopping Spree",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Pick prizes until the cart total beats the target.",
  initialData: { board: ["BUY","SKIP","CART","TOTAL","GOAL"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Buy Prize",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Skip Prize",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Cart",
      "tone": "blue"
    }
  ]
});
