import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "any-number",
  name: "Any Number",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Pick the digits that build the car, prize, or chaos target.",
  initialData: { board: ["CAR","FIRST","SECOND","PIGGY","0","1","2","3","4","5"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Reveal Digits",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Number Pop",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Lock Blast",
      "tone": "blue"
    }
  ]
});
