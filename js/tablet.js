import { getContestant, patchShow, subscribeShow, updateContestant } from "./state.js";
import { getGameMeta, loadGame } from "./games-registry.js?v=12";
import { formatTarget, rankContestants, winnerText } from "./score-system.js";

const app = document.getElementById("tabletApp");
const params = new URLSearchParams(location.search);
const isHostTablet = params.get("host") === "1" || params.get("c") === "host";
let contestantId = params.get("c") || localStorage.getItem("tcic.tabletContestant") || "";
let currentState = null;
let currentGame = null;
let currentGameId = "";

subscribeShow(async (state) => {
  currentState = state;
  if (state.currentGame && state.currentGame !== currentGameId) {
    currentGameId = state.currentGame;
    currentGame = await loadGame(state.currentGame);
  }
  render();
});

setInterval(() => {
  const node = app.querySelector("[data-tablet-timer]");
  if (node && currentState) node.textContent = timeLeft(currentState);
  const hostNode = app.querySelector("[data-host-tablet-timer]");
  if (hostNode && currentState) hostNode.textContent = timeLeft(currentState);
}, 300);

app.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !currentState) return;
  if (button.dataset.pickContestant) {
    contestantId = button.dataset.pickContestant;
    localStorage.setItem("tcic.tabletContestant", contestantId);
    render();
  }
  if (button.matches("[data-lock-answer]")) {
    const input = app.querySelector("[data-answer-input]");
    lockAnswer(input?.value || "");
  }
  if (button.dataset.quickAnswer) {
    const input = app.querySelector("[data-answer-input]");
    if (input) input.value = button.dataset.quickAnswer;
  }
  if (button.matches("[data-buzzer]")) {
    buzz();
  }
});

function lockAnswer(answer) {
  const contestants = updateContestant(currentState, contestantId, () => ({
    answer,
    locked: true,
    buzzer: 0
  }));
  return patchShow({ contestants, revealText: "LOCKED IN" });
}

function buzz() {
  const contestants = updateContestant(currentState, contestantId, () => ({
    buzzer: Date.now()
  }));
  return patchShow({ contestants, transitionText: "BUZZ" });
}

function render() {
  if (!currentState) {
    app.innerHTML = `<section class="tablet-card"><h1 class="tablet-name">Connecting...</h1></section>`;
    return;
  }
  if (isHostTablet) {
    renderHostTablet();
    return;
  }
  if (!contestantId || !getContestant(currentState, contestantId)) {
    app.innerHTML = `
      <section class="tablet-card">
        <h1 class="tablet-name">Pick Tablet</h1>
        <div class="select-contestant">
          ${(currentState.contestants || []).map((contestant) => `<button class="tablet-button" data-pick-contestant="${contestant.id}" style="background:${contestant.color}">${contestant.name}</button>`).join("")}
        </div>
      </section>
    `;
    return;
  }
  const contestant = getContestant(currentState, contestantId);
  const meta = currentState.currentGame ? getGameMeta(currentState.currentGame) : null;
  app.innerHTML = `
    <section class="tablet-card" style="--contestant-color:${contestant.color};${meta ? `--game-a:${meta.colors[0]};--game-b:${meta.colors[1]};--game-c:${meta.colors[2]}` : ""}">
      <header>
        <h1 class="tablet-name">${escapeHtml(contestant.name)}</h1>
        <div class="tablet-score">${Number(contestant.score || 0).toLocaleString()}</div>
      </header>
      <div class="tv-lower-third">
        <div class="lower-label" data-tablet-timer>${timeLeft(currentState)}</div>
        <div class="lower-copy">${escapeHtml(meta?.name || "Stand By")}</div>
      </div>
      ${currentState.phase === "showcase" || currentState.phase === "showcase-reveal" ? showcaseTablet(contestant) : currentGame && currentState.currentGame ? currentGame.renderTablet(currentState, contestant) : idleTablet()}
      <footer class="shortcut-strip">
        <span class="keycap">${contestant.locked ? "Answer locked" : "Awaiting lock-in"}</span>
        <span class="keycap">${currentState.buzzersEnabled ? "Buzzers live" : "Buzzers closed"}</span>
        <span class="keycap">${escapeHtml(currentState.product?.name || "Mystery prize")}</span>
      </footer>
    </section>
  `;
}

function showcaseTablet(contestant) {
  return `
    <div class="tablet-form">
      <div class="tablet-prompt">Showcase bid. Closest without going over wins.</div>
      <input class="tablet-input" inputmode="text" data-answer-input placeholder="$???? / FREE / ⭐"
        value="${escapeHtml(contestant?.answer || "")}">
      <button class="tablet-button ${contestant?.locked ? "locked" : ""}" data-lock-answer>
        ${contestant?.locked ? "Bid Locked" : "Lock Bid"}
      </button>
      <div class="tablet-pills">
        <button class="pill-button" data-quick-answer="$1000">$1000</button>
        <button class="pill-button" data-quick-answer="$2500">$2500</button>
        <button class="pill-button" data-quick-answer="$5000">$5000</button>
      </div>
    </div>
  `;
}

function renderHostTablet() {
  const ranked = rankContestants(currentState.contestants || []);
  const leader = ranked[0];
  const locked = (currentState.contestants || []).filter((contestant) => contestant.locked).length;
  const meta = currentState.currentGame ? getGameMeta(currentState.currentGame) : null;
  app.innerHTML = `
    <section class="tablet-card host-tablet-card" style="--contestant-color:#ffd029;${meta ? `--game-a:${meta.colors[0]};--game-b:${meta.colors[1]};--game-c:${meta.colors[2]}` : ""}">
      <header>
        <h1 class="tablet-name">Host Tablet</h1>
        <div class="tablet-score" data-host-tablet-timer>${timeLeft(currentState)}</div>
      </header>
      <div class="host-tablet-grid">
        <div class="host-tablet-tile big">
          <span>Current Winner</span>
          <strong>${escapeHtml(leader?.name || "TBD")}</strong>
          <em>${Number(leader?.score || 0).toLocaleString()} pts</em>
        </div>
        <div class="host-tablet-tile">
          <span>Game</span>
          <strong>${escapeHtml(meta?.name || "Idle")}</strong>
        </div>
        <div class="host-tablet-tile">
          <span>Round</span>
          <strong>${Number(currentState.round || 1)}</strong>
        </div>
        <div class="host-tablet-tile">
          <span>Locks</span>
          <strong>${locked}/${(currentState.contestants || []).length}</strong>
        </div>
        <div class="host-tablet-tile wide">
          <span>Round Target</span>
          <strong>${escapeHtml(currentState.product?.name || "Mystery Prize")}</strong>
          <em>${escapeHtml(formatTarget(currentState.product?.price))}</em>
        </div>
        <div class="host-tablet-tile wide">
          <span>Winner Text</span>
          <strong>${escapeHtml(winnerText(currentState.contestants || []))}</strong>
        </div>
      </div>
      <div class="host-lock-list">
        ${(currentState.contestants || []).map((contestant) => `
          <div class="host-lock-row" style="--contestant-color:${contestant.color}">
            <b>${escapeHtml(contestant.name)}</b>
            <span>${Number(contestant.score || 0).toLocaleString()}</span>
            <span>${contestant.locked ? "LOCKED" : "OPEN"}</span>
            <span>${escapeHtml(contestant.answer || "-")}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function idleTablet() {
  return `
    <div class="tablet-form">
      <div class="tablet-prompt">Stand by. Audience screen is on the TCIC idle card.</div>
      <button class="tablet-button" data-buzzer>Test Buzz</button>
    </div>
  `;
}

function timeLeft(state) {
  if (!state.timer?.running || !state.timer?.endsAt) return state.timer?.duration || 0;
  return Math.max(0, Math.ceil((Number(state.timer.endsAt) - Date.now()) / 1000));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
