import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "safe-crackers",
  name: "Safe Crackers",
  colors: ["#656d83", "#ffd029", "#00d7ff"],
  instruction: "Arrange the digits, crack the safe, and pretend you planned it.",
  mode: "digits",
  renderTV() {
    return `<section class="safe-dial-wrap"><div class="safe-dial"></div></section>`;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button blue" data-game-action="spin">Spin Dial</button>
        <button class="shock-button gold" data-game-action="openSafe">Open Safe</button>
        <button class="shock-button hot" data-game-action="alarm">Wrong Alarm</button>
      </div>
    `;
  }
});
