import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "lucky-seven",
  name: "Lucky $even",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Guess each digit while protecting seven dollars.",
  initialData: { board: ["7","6","5","4","3","2","1","0"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Spend Dollar",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Keep Dollar",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Digit",
      "tone": "blue"
    }
  ]
});
