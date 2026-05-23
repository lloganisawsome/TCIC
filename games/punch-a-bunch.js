import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "punch-a-bunch",
  name: "Punch-a-Bunch",
  colors: ["#ff7a18", "#ff2f6d", "#ffd029"],
  instruction: "Pick a hole and punch destiny directly in the face.",
  initialData: { punches: ["$50", "$250", "$1K", "$25", "$500", "$2K", "$100", "$10K", "$75", "$750"] },
  renderTV(state) {
    const punches = state.gameData?.punches || [];
    return `<section class="punch-grid">${punches.map((p, i) => `<div class="punch-hole" style="animation-delay:${i * .06}s">${p}</div>`).join("")}</section>`;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button hot" data-game-action="punch">Punch Reveal</button>
        <button class="shock-button gold" data-game-action="cashstorm">Cash Storm</button>
        <button class="shock-button blue" data-game-action="reveal">Final Envelope</button>
      </div>
    `;
  }
});
