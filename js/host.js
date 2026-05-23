import {
  adjustScore,
  freshShowState,
  patchShow,
  randomProduct,
  replaceShow,
  startTimer,
  stopTimer,
  subscribeShow,
  subscribeSyncStatus,
  unlockAll
} from "./state.js";
import { GAME_CATALOG, getGameMeta, loadGame } from "./games-registry.js";
import { applyRevealScores, formatTarget, rankContestants, winnerText } from "./score-system.js";

const app = document.getElementById("hostApp");
let currentState = null;
let currentGame = null;
let currentGameId = "";
let online = false;
let syncStatus = { mode: "local", online: false, error: "" };

subscribeShow(async (state) => {
  online = true;
  currentState = state;
  if (state.currentGame && state.currentGame !== currentGameId) {
    currentGameId = state.currentGame;
    currentGame = await loadGame(state.currentGame);
  }
  render();
});

subscribeSyncStatus((status) => {
  syncStatus = status;
  renderSyncStatus();
});

setInterval(() => {
  if (!currentState) return;
  renderTimerOnly();
}, 500);

app.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || !currentState) return;
  const { action, gameId, contestantId, delta, gameAction } = button.dataset;
  if (gameId) return launchGame(gameId);
  if (contestantId && delta) return adjustScore(currentState, contestantId, Number(delta), "host");
  if (gameAction) return handleGameAction(gameAction);

  switch (action) {
    case "idle":
      return patchShow({ phase: "idle", currentGame: "", revealText: "", transitionText: "", lowerThird: "Standing by." });
    case "intro":
      return patchShow({ phase: "intro", transitionText: "ROUND INTRO", revealText: "", lowerThird: "New round. New prices. Same questionable confidence." });
    case "timer":
      return currentState.timer?.running ? stopTimer(currentState) : startTimer(Number(app.querySelector("[data-timer-seconds]")?.value || 30));
    case "timer-screen":
      return patchShow({ phase: "timer", transitionText: "BIG TIMER", revealText: "", lowerThird: "Clock is on the big screen." });
    case "setup":
      return patchShow({ phase: "setup", currentGame: "", transitionText: "SETUP", revealText: "", lowerThird: "Contestants and prize list are being loaded." });
    case "reveal":
      return currentGame ? applyRevealScores(currentState, currentGame) : patchShow({ phase: "reveal", revealText: `TARGET ${formatTarget(currentState.product?.price)}`, lowerThird: `Target answer: ${formatTarget(currentState.product?.price)}` });
    case "next":
      return nextRound();
    case "scoreboard":
      return patchShow({ phase: "scoreboard", transitionText: "SCOREBOARD", revealText: "", lowerThird: "Current standings." });
    case "wheel":
      return patchShow({ phase: "wheel", currentGame: "", transitionText: "BIG WHEEL", revealText: "", lowerThird: "Spin-off time." });
    case "spin-wheel":
      return spinWheel();
    case "showcase":
      return patchShow({ phase: "showcase", currentGame: "", transitionText: "SHOWCASE", revealText: "", lowerThird: "Final package bid. Closest without going over wins." });
    case "showcase-reveal":
      return revealShowcase();
    case "buzzers":
      return patchShow({ buzzersEnabled: !currentState.buzzersEnabled, transitionText: currentState.buzzersEnabled ? "BUZZERS OFF" : "BUZZERS LIVE" });
    case "sponsor":
      return patchShow({ phase: "sponsor", transitionText: "SPONSOR", revealText: "", lowerThird: currentState.sponsor || "Fake sponsor break." });
    case "winner":
      return patchShow({ phase: "winner", revealText: "", transitionText: "WINNER", lowerThird: winnerText(currentState.contestants || []) });
    case "product":
      return chooseRandomProduct();
    case "apply-product":
      return applyScriptedProduct();
    case "add-product":
      return addProduct();
    case "apply-products":
      return applyProductList();
    case "next-product":
      return nextProduct();
    case "apply-contestants":
      return applyContestantSetup();
    case "add-contestant":
      return addContestant();
    case "reset":
      return replaceShow(freshShowState());
    case "save":
      localStorage.setItem("tcic.savedEpisode", JSON.stringify(currentState));
      return flashLocal("Episode saved to this browser.");
    case "load":
      return loadSavedEpisode();
    default:
      return null;
  }
});

app.addEventListener("change", (event) => {
  const target = event.target;
  if (!currentState) return;
  if (target.matches("[data-episode-name]")) {
    patchShow({ episodeName: target.value });
  }
  if (target.matches("[data-sponsor]")) {
    patchShow({ sponsor: target.value });
  }
  if (target.matches("[data-lower-third]")) {
    patchShow({ lowerThird: target.value });
  }
  if (target.matches("[data-product-name]")) {
    patchShow({ product: { ...(currentState.product || {}), name: target.value } });
  }
  if (target.matches("[data-product-price]")) {
    patchShow({ product: { ...(currentState.product || {}), price: target.value } });
  }
  if (target.matches("[data-contestant-name]")) {
    const contestants = currentState.contestants.map((contestant) => contestant.id === target.dataset.contestantName ? { ...contestant, name: target.value } : contestant);
    patchShow({ contestants });
  }
  if (target.matches("[data-contestant-photo]")) {
    const contestants = currentState.contestants.map((contestant) => contestant.id === target.dataset.contestantPhoto ? { ...contestant, photo: target.value } : contestant);
    patchShow({ contestants });
  }
  if (target.matches("[data-contestant-color]")) {
    const contestants = currentState.contestants.map((contestant) => contestant.id === target.dataset.contestantColor ? { ...contestant, color: target.value } : contestant);
    patchShow({ contestants });
  }
  if (target.matches("[data-contestant-score]")) {
    const contestants = currentState.contestants.map((contestant) => contestant.id === target.dataset.contestantScore ? { ...contestant, score: Number(target.value || 0) } : contestant);
    patchShow({ contestants });
  }
});

document.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
  const key = event.key.toLowerCase();
  if (key === " ") {
    event.preventDefault();
    app.querySelector('[data-action="reveal"]')?.click();
  }
  if (key === "enter") app.querySelector('[data-action="next"]')?.click();
  if (key === "t") app.querySelector('[data-action="timer"]')?.click();
  if (key === "b") app.querySelector('[data-action="buzzers"]')?.click();
  if (["1", "2", "3"].includes(key)) {
    const contestant = currentState?.contestants?.[Number(key) - 1];
    if (contestant) adjustScore(currentState, contestant.id, 500, "winner shortcut");
  }
});

async function launchGame(gameId) {
  const game = await loadGame(gameId);
  const product = currentState.product || randomProduct();
  const stateForGame = { ...currentState, product };
  return patchShow({
    currentGame: gameId,
    phase: "game",
    product,
    gameData: game.makeInitialData(stateForGame),
    revealText: "",
    transitionText: getGameMeta(gameId).name,
    lowerThird: `${getGameMeta(gameId).name}: ${game.instruction}`,
    contestants: unlockAll(currentState.contestants)
  });
}

function applyScriptedProduct() {
  const name = app.querySelector("[data-product-name]")?.value || "Mystery Prize";
  const price = app.querySelector("[data-product-price]")?.value || "";
  return patchShow({
    product: { ...(currentState.product || {}), name, price },
    transitionText: "TARGET SET",
    revealText: "",
    lowerThird: `${name} is loaded for this round.`
  });
}

function chooseRandomProduct() {
  const products = currentState.products?.length ? currentState.products : [randomProduct()];
  const selectedProductIndex = Math.floor(Math.random() * products.length);
  return patchShow({ product: products[selectedProductIndex], selectedProductIndex, transitionText: "NEW PRIZE", revealText: "" });
}

function nextProduct() {
  const products = currentState.products?.length ? currentState.products : [currentState.product || randomProduct()];
  const selectedProductIndex = (Number(currentState.selectedProductIndex || 0) + 1) % products.length;
  return patchShow({ product: products[selectedProductIndex], selectedProductIndex, transitionText: "NEXT PRIZE", revealText: "" });
}

function addProduct() {
  const products = [...(currentState.products || [])];
  products.push({ name: `Prize ${products.length + 1}`, price: "", image: "" });
  return patchShow({ products });
}

function applyProductList() {
  const rows = [...app.querySelectorAll("[data-product-row]")];
  const products = rows.map((row, index) => ({
    name: row.querySelector("[data-product-list-name]")?.value || `Prize ${index + 1}`,
    price: row.querySelector("[data-product-list-price]")?.value || "",
    image: row.querySelector("[data-product-list-image]")?.value || ""
  })).filter((product) => product.name.trim());
  const selectedProductIndex = Math.min(Number(currentState.selectedProductIndex || 0), Math.max(0, products.length - 1));
  return patchShow({
    products,
    selectedProductIndex,
    product: products[selectedProductIndex] || currentState.product,
    transitionText: "PRIZE LIST SAVED",
    revealText: ""
  });
}

function addContestant() {
  const colors = ["#ff2f6d", "#00d7ff", "#ffd029", "#48ff65", "#7f43ff"];
  const contestants = [...(currentState.contestants || [])];
  contestants.push({
    id: `c${Date.now()}`,
    name: `Player ${contestants.length + 1}`,
    color: colors[contestants.length % colors.length],
    photo: "",
    score: 0,
    streak: 0,
    locked: false,
    answer: "",
    buzzer: 0
  });
  return patchShow({ contestants });
}

function applyContestantSetup() {
  const contestants = [...app.querySelectorAll("[data-setup-contestant-row]")].map((row, index) => ({
    id: row.dataset.contestantId || `c${index + 1}`,
    name: row.querySelector("[data-setup-contestant-name]")?.value || `Player ${index + 1}`,
    color: row.querySelector("[data-setup-contestant-color]")?.value || "#ff2f6d",
    photo: row.querySelector("[data-setup-contestant-photo]")?.value || "",
    score: Number(row.querySelector("[data-setup-contestant-score]")?.value || 0),
    streak: 0,
    locked: false,
    answer: "",
    buzzer: 0
  }));
  return patchShow({ contestants, phase: "setup", transitionText: "CONTESTANTS SAVED", revealText: "" });
}

function spinWheel() {
  const contestants = currentState.contestants || [];
  const contestant = contestants[Number(currentState.wheel?.spins?.length || 0) % contestants.length] || contestants[0];
  const segments = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const value = segments[Math.floor(Math.random() * segments.length)];
  const spin = { contestantId: contestant?.id || "", name: contestant?.name || "Player", value, at: Date.now() };
  return patchShow({
    phase: "wheel",
    wheel: { value, contestantId: spin.contestantId, spins: [...(currentState.wheel?.spins || []), spin] },
    transitionText: `${spin.name} SPINS ${value}`,
    revealText: ""
  });
}

function revealShowcase() {
  const price = currentState.showcase?.price || currentState.product?.price || "";
  return patchShow({
    phase: "showcase-reveal",
    showcase: { ...(currentState.showcase || {}), price, revealed: true },
    transitionText: "SHOWCASE REVEAL",
    revealText: ""
  });
}

function nextRound() {
  return patchShow({
    round: Number(currentState.round || 1) + 1,
    phase: "game",
    revealText: "",
    transitionText: "NEXT ROUND",
    lowerThird: currentGame?.instruction || "Lock in a price before the stage gets louder.",
    contestants: unlockAll(currentState.contestants)
  });
}

function handleGameAction(action) {
  const data = currentState.gameData || {};
  const patches = {
    reveal: { revealText: `TARGET ${formatTarget(currentState.product?.price)}`, lowerThird: `${currentState.product?.name || "Mystery prize"} target: ${formatTarget(currentState.product?.price)}` },
    randomize: { product: randomProduct(), transitionText: "NEW PRIZE", revealText: "" },
    lockblast: { revealText: "LOCKED IN" },
    dropchip: { gameData: { ...data, chipX: 12 + Math.floor(Math.random() * 76), chipY: 4 }, transitionText: "DROP IT" },
    bigslot: { gameData: { ...data, slots: [100, 500, 1000, 5000, 1000, 500] }, transitionText: "JACKPOT ENERGY" },
    climb: { gameData: { ...data, steps: Math.min(32, Number(data.steps || 0) + 5) }, transitionText: "HE CLIMBS" },
    saveclimber: { gameData: { ...data, steps: 4 }, transitionText: "MIRACLE SAVE" },
    punch: { revealText: "PUNCH REVEAL" },
    cashstorm: { transitionText: "CASH STORM" },
    higher: { gameData: { ...data, feedback: "HIGHER" }, transitionText: "HIGHER" },
    lower: { gameData: { ...data, feedback: "LOWER" }, transitionText: "LOWER" },
    correct: { gameData: { ...data, feedback: "CORRECT" }, revealText: "CORRECT" },
    spin: { transitionText: "SPIN IT" },
    openSafe: { revealText: "SAFE OPEN" },
    alarm: { revealText: "WRONG CODE" },
    freezeRange: { revealText: "RANGE LOCKED" }
  };
  return patchShow(patches[action] || { transitionText: action.toUpperCase() });
}

function loadSavedEpisode() {
  const saved = localStorage.getItem("tcic.savedEpisode");
  if (!saved) return flashLocal("No saved episode in this browser.");
  return replaceShow(JSON.parse(saved));
}

function flashLocal(message) {
  app.querySelector("[data-local-status]").textContent = message;
  setTimeout(() => {
    const node = app.querySelector("[data-local-status]");
    if (node) node.textContent = "";
  }, 1800);
}

function render() {
  if (!currentState) {
    app.innerHTML = `<section class="host-card"><h2>Connecting to Firebase...</h2></section>`;
    return;
  }
  const state = currentState;
  const meta = state.currentGame ? getGameMeta(state.currentGame) : null;
  const preview = currentGame && state.currentGame ? currentGame.renderTV(state) : `<section class="idle-fallback">TCIC</section>`;
  app.innerHTML = `
    <header class="host-topbar">
      <div>
        <h1 class="host-title">The Cost Is Correct Control Room</h1>
        <div class="shortcut-strip">
          <span class="keycap">SPACE Reveal</span><span class="keycap">ENTER Next</span><span class="keycap">1/2/3 +500</span><span class="keycap">T Timer</span><span class="keycap">B Buzzers</span>
          <a class="keycap" href="./guide.html?v=11">Game Guide</a>
        </div>
      </div>
      <div class="connection" data-sync-status><span class="dot ${syncStatus.online ? "online" : ""}"></span> ${syncLabel()}</div>
    </header>
    <section class="host-grid">
      <aside class="host-card">
        <h2>Show Flow</h2>
        <div class="control-grid">
          <button class="shock-button dark" data-action="idle">Idle Logo</button>
          <button class="shock-button blue" data-action="setup">Setup Screen</button>
          <button class="shock-button blue" data-action="intro">Intro Sting</button>
          <button class="shock-button hot" data-action="reveal">Reveal</button>
          <button class="shock-button green" data-action="next">Next Round</button>
          <button class="shock-button gold" data-action="timer">Timer <span data-host-timer>${timeLeft(state)}</span></button>
          <button class="shock-button gold" data-action="timer-screen">Big Timer</button>
          <button class="shock-button blue" data-action="buzzers">${state.buzzersEnabled ? "Buzzers On" : "Buzzers Off"}</button>
          <button class="shock-button green" data-action="scoreboard">Scoreboard</button>
          <button class="shock-button gold" data-action="wheel">Big Wheel</button>
          <button class="shock-button hot" data-action="spin-wheel">Spin Wheel</button>
          <button class="shock-button blue" data-action="showcase">Showcase</button>
          <button class="shock-button hot" data-action="showcase-reveal">Reveal Showcase</button>
          <button class="shock-button dark" data-action="sponsor">Fake Sponsor</button>
          <button class="shock-button hot" data-action="winner">Winner Screen</button>
          <button class="shock-button gold" data-action="product">Random Product</button>
          <button class="shock-button green" data-action="next-product">Next Product</button>
          <button class="shock-button dark" data-action="save">Save Episode</button>
          <button class="shock-button blue" data-action="load">Load Episode</button>
          <button class="shock-button hot" data-action="reset">Reset Show</button>
        </div>
        <div class="field-row" style="margin-top:10px">
          <input class="host-input" data-timer-seconds type="number" min="5" max="300" value="${state.timer?.duration || 30}">
          <span class="keycap">seconds</span>
        </div>
        <h2 style="margin-top:18px">Round Target</h2>
        <div class="control-grid">
          <input class="host-input" data-product-name placeholder="Prize name" value="${escapeHtml(state.product?.name || "")}">
          <input class="host-input" data-product-price type="text" placeholder="$499 / FREE / ??? / ⭐" value="${escapeHtml(state.product?.price || "")}">
          <button class="shock-button gold full" data-action="apply-product">Set Round Target</button>
        </div>
        <h2 style="margin-top:18px">Pre-Show Products</h2>
        <div class="product-list-editor">
          ${(state.products || []).map(productRow).join("")}
        </div>
        <div class="control-grid" style="margin-top:10px">
          <button class="shock-button blue" data-action="add-product">Add Product</button>
          <button class="shock-button gold" data-action="apply-products">Save Products</button>
        </div>
        <div class="control-grid" style="margin-top:10px">
          <input class="host-input" data-episode-name value="${escapeHtml(state.episodeName || "")}">
          <input class="host-input" data-sponsor value="${escapeHtml(state.sponsor || "")}">
          <input class="host-input" data-lower-third value="${escapeHtml(state.lowerThird || "")}">
        </div>
        <p class="keycap" data-local-status></p>
      </aside>

      <section class="host-card">
        <h2>Current Game ${meta ? `- ${escapeHtml(meta.name)}` : ""}</h2>
        <div class="host-runbook">
          <strong>Run it live:</strong>
          pick a game, set round target, start timer, contestants lock answers, then hit reveal. Award bonus points with the score buttons or 1/2/3.
        </div>
        <div class="host-preview game-surface" style="${meta ? `--game-a:${meta.colors[0]};--game-b:${meta.colors[1]};--game-c:${meta.colors[2]}` : ""}">${preview}</div>
        <div class="host-controls">${currentGame?.renderHost(state) || ""}</div>
        <h2 style="margin-top:18px">Game Launcher</h2>
        <div class="game-list">
          ${GAME_CATALOG.map((game) => `
            <button class="game-pick ${state.currentGame === game.id ? "active" : ""}" data-game-id="${game.id}" style="--game-a:${game.colors[0]};--game-b:${game.colors[1]}">${escapeHtml(game.name)}</button>
          `).join("")}
        </div>
      </section>

      <aside class="host-card">
        <h2>Scores + Contestants</h2>
        <div class="control-grid" style="margin-bottom:10px">
          <button class="shock-button blue" data-action="add-contestant">Add Contestant</button>
          <button class="shock-button gold" data-action="apply-contestants">Save Setup</button>
        </div>
        <div class="contestant-editor">
          ${(state.contestants || []).map(contestantEditor).join("")}
        </div>
        <h2 style="margin-top:18px">Episode Stats</h2>
        <div class="generic-grid" style="height:auto;padding:8px">
          <div class="generic-card">${state.round || 1}<br>ROUND</div>
          <div class="generic-card">${state.stats?.reveals || 0}<br>REVEALS</div>
          <div class="generic-card">${state.stats?.totalPointsAwarded || 0}<br>POINTS</div>
          <div class="generic-card">${escapeHtml(rankContestants(state.contestants || [])[0]?.name || "TBD")}<br>LEADS</div>
          <div class="generic-card">${escapeHtml(formatTarget(state.product?.price))}<br>TARGET</div>
        </div>
      </aside>
    </section>
  `;
}

function contestantEditor(contestant, index) {
  return `
    <div class="contestant-row" data-setup-contestant-row data-contestant-id="${contestant.id}" style="--contestant-color:${contestant.color}">
      <span class="color-dot"></span>
      <input class="host-input" data-contestant-name="${contestant.id}" data-setup-contestant-name value="${escapeHtml(contestant.name)}">
      <input class="host-input" data-contestant-score="${contestant.id}" data-setup-contestant-score type="number" value="${Number(contestant.score || 0)}">
      <input class="host-input" data-contestant-photo="${contestant.id}" data-setup-contestant-photo placeholder="Photo URL optional" value="${escapeHtml(contestant.photo || "")}" style="grid-column:1/-1">
      <input class="host-input" data-contestant-color="${contestant.id}" data-setup-contestant-color type="color" value="${escapeHtml(contestant.color || "#ff2f6d")}">
      <div class="score-buttons" style="grid-column:1/-1">
        <button class="shock-button small green" data-contestant-id="${contestant.id}" data-delta="100">+100</button>
        <button class="shock-button small gold" data-contestant-id="${contestant.id}" data-delta="500">+500</button>
        <button class="shock-button small blue" data-contestant-id="${contestant.id}" data-delta="1000">+1000</button>
        <button class="shock-button small hot" data-contestant-id="${contestant.id}" data-delta="-100">-100</button>
      </div>
      <span class="keycap" style="grid-column:1/-1">Shortcut ${index + 1}: award +500. Answer: ${escapeHtml(contestant.answer || "none")} ${contestant.locked ? "LOCKED" : ""}</span>
    </div>
  `;
}

function productRow(product, index) {
  return `
    <div class="product-row" data-product-row>
      <span class="keycap">${index + 1}</span>
      <input class="host-input" data-product-list-name placeholder="Item name" value="${escapeHtml(product.name || "")}">
      <input class="host-input" data-product-list-price placeholder="Price / target" value="${escapeHtml(product.price || "")}">
      <input class="host-input" data-product-list-image placeholder="Image URL optional" value="${escapeHtml(product.image || "")}">
    </div>
  `;
}

function renderTimerOnly() {
  const timer = app.querySelector("[data-host-timer]");
  if (timer) timer.textContent = timeLeft(currentState);
}

function renderSyncStatus() {
  const node = app.querySelector("[data-sync-status]");
  if (!node) return;
  node.innerHTML = `<span class="dot ${syncStatus.online ? "online" : ""}"></span> ${syncLabel()}`;
}

function syncLabel() {
  if (syncStatus.online) return `Saving: ${syncStatus.mode}`;
  return syncStatus.error ? `Local: ${syncStatus.error}` : "Local sync";
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
