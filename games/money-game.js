import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "money-game",
  name: "Money Game",
  colors: ["#ffd029", "#1ecf68", "#00d7ff"],
  instruction: "Pick number tiles and assemble a price before the board roasts you.",
  mode: "digits",
  initialData: { board: ["19", "24", "35", "42", "58", "67", "73", "80", "96", "01", "12", "99"] },
  renderTV(state) {
    const board = state.gameData?.board || [];
    return `<section class="number-board">${board.map((tile, i) => `<div class="money-tile" style="--tilt:${i % 2 ? -2 : 2}deg">${tile}</div>`).join("")}</section>`;
  }
});
