import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "grocery-game",
  name: "Grocery Game",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Build a cart total that lands inside the target range.",
  initialData: { board: ["CHIPS","SOAP","SODA","CEREAL","CANDY","SAUCE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Add Item",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Total Cart",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Total",
      "tone": "blue"
    }
  ]
});
