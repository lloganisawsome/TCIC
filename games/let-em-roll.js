import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "let-em-roll",
  name: "Let 'Em Roll",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Earn rolls, roll symbols, and chase the top prize.",
  initialData: { board: ["CAR","CAR","$500","$1000","ROLL","WILD"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Roll Cubes",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Bank Cash",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Cubes",
      "tone": "blue"
    }
  ]
});
