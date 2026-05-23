import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "pay-the-rent",
  name: "Pay The Rent",
  colors: ["#ff2f6d", "#00d7ff", "#ffd029"],
  mode: "choices",
  instruction: "Stack items by value floor and reveal from bottom to top.",
  initialData: { board: ["MAILBOX","1ST","2ND","ATTIC","RENT"] },
  hostActions: [
    {
      "id": "reveal",
      "label": "Move Floor",
      "tone": "hot"
    },
    {
      "id": "lockblast",
      "label": "Reveal Floor",
      "tone": "gold"
    },
    {
      "id": "randomize",
      "label": "Cash Out",
      "tone": "blue"
    }
  ]
});
