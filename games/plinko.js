import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "plinko",
  name: "Plinko",
  colors: ["#ff2f6d", "#ffd029", "#00d7ff"],
  instruction: "Pick a drop lane, lock your price guess, then scream at physics.",
  mode: "digits",
  initialData: { chipX: 50, chipY: 6, slots: [0, 100, 500, 1000, 500, 100] },
  renderTV(state) {
    const data = state.gameData || {};
    const pegs = Array.from({ length: 63 }, (_, i) => `<span class="peg" style="opacity:${.72 + (i % 3) * .09}"></span>`).join("");
    const slots = (data.slots || [0, 100, 500, 1000, 500, 100]).map((slot) => `<div class="slot">$${slot}</div>`).join("");
    return `
      <section class="plinko-board">
        <div class="peg-field">
          ${pegs}
          <div class="plinko-chip" style="--chip-x:${data.chipX || 48};--chip-y:${data.chipY || 4}"></div>
        </div>
        <div class="slots">${slots}</div>
      </section>
    `;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button hot" data-game-action="dropchip">Drop Chip</button>
        <button class="shock-button gold" data-game-action="bigslot">Jackpot Slot</button>
        <button class="shock-button blue" data-game-action="reveal">Reveal Price</button>
      </div>
    `;
  },
  renderTablet(state, contestant) {
    return `
      <div class="tablet-form">
        <div class="tablet-prompt">Choose lane and price guess before the chip gets dramatic.</div>
        <input class="tablet-input" inputmode="text" data-answer-input placeholder="$??? / FREE / ⭐" value="${contestant?.answer || ""}">
        <div class="tablet-pills">
          <button class="pill-button" data-quick-answer="LEFT">LEFT</button>
          <button class="pill-button" data-quick-answer="CENTER">CENTER</button>
          <button class="pill-button" data-quick-answer="RIGHT">RIGHT</button>
        </div>
        <button class="tablet-button ${contestant?.locked ? "locked" : ""}" data-lock-answer>${contestant?.locked ? "Chip Locked" : "Drop Me"}</button>
      </div>
    `;
  }
});
