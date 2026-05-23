import { makePricingGame } from "./_factory.js";

export default makePricingGame({
  id: "cliffhangers",
  name: "Cliff Hangers",
  colors: ["#00a6ff", "#fff1a8", "#4030ff"],
  instruction: "Guess the price. Every miss sends the tiny climber closer to fame.",
  initialData: { steps: 8 },
  renderTV(state) {
    const steps = Number(state.gameData?.steps || 8);
    return `
      <section class="mountain-game" style="--steps:${steps}">
        <div class="mountain"></div>
        <div class="climber"></div>
      </section>
    `;
  },
  renderHost() {
    return `
      <div class="host-controls">
        <button class="shock-button hot" data-game-action="climb">Climb +5</button>
        <button class="shock-button blue" data-game-action="saveclimber">Miracle Save</button>
        <button class="shock-button gold" data-game-action="reveal">Reveal Price</button>
      </div>
    `;
  }
});
