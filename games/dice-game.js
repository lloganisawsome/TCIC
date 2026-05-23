import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "dice-game",
  name: "Dice Game",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Roll each digit, call higher or lower, and lock the final target.",
  initialData: { board: ["1","2","3","4","5","6","HIGH","LOW"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Roll Dice",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Higher/Lower",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Roll",
      "tone": "blue"
    }
  ]
});
