import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "line-em-up",
  name: "Line 'Em Up",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Slide digits or text chunks into the target line.",
  initialData: { board: ["LEFT","UP","DOWN","RIGHT","LOCK"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Move Line",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Check Count",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Line",
      "tone": "blue"
    }
  ]
});
