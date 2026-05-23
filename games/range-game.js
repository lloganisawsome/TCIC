import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "range-game",
  name: "Range Game",
  colors: ["#48ff65", "#00d7ff", "#ff2f6d"],
  instruction: "Stop the moving range window where confidence and panic overlap.",
  renderTV() {
    return `
      <section class="range-track">
        <div class="generic-card">STOP THE WINDOW</div>
        <div class="range-bar"><div class="range-window"></div></div>
        <div class="generic-card">$100 .......... $900</div>
      </section>
    `;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button hot" data-game-action="freezeRange">Freeze Range</button>
        <button class="shock-button gold" data-game-action="reveal">Reveal Target</button>
      </div>
    `;
  }
});
