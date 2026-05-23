import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "clock-game",
  name: "Clock Game",
  colors: ["#fb003f", "#ffd029", "#00d7ff"],
  instruction: "Guess fast. The host yells HIGHER or LOWER like a caffeinated auctioneer.",
  initialData: { feedback: "READY" },
  renderTV(state) {
    const feedback = state.gameData?.feedback || "READY";
    return `
      <section class="generic-grid">
        <div class="generic-card">30 SEC</div>
        <div class="clock-feedback">${feedback}</div>
        <div class="generic-card">${state.product?.name || "Mystery Prize"}</div>
      </section>
    `;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button green" data-game-action="higher">Higher</button>
        <button class="shock-button hot" data-game-action="lower">Lower</button>
        <button class="shock-button gold" data-game-action="correct">Correct</button>
      </div>
    `;
  }
});
