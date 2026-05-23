import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "squeeze-play",
  name: "Squeeze Play",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Remove the extra character and squeeze the target together.",
  initialData: { board: ["1","2","X","3","4","SQUEEZE"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Remove Digit",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Reset",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal Squeeze",
      "tone": "blue"
    }
  ]
});
