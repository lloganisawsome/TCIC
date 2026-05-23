import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "one-away",
  name: "One Away",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "digits",
  instruction: "Each character is one away; adjust the target and ask for mercy.",
  initialData: { board: ["+1","-1","HONK","CHANGE","LOCK"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Honk",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Change Digit",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Reveal",
      "tone": "blue"
    }
  ]
});
