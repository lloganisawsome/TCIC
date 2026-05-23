import { subscribeShow } from "./state.js";
import { getGameMeta, loadGame } from "./games-registry.js";
import { formatTarget, rankContestants, winnerText } from "./score-system.js";

const app = document.getElementById("tvApp");
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

setInterval(updateTimer, 400);

function render() {
  if (!currentState) return;
  const state = currentState;
  if (state.phase === "idle") {
    app.innerHTML = `
      <section class="idle-screen">
        <img src="./assets/TCIC.png" alt="The Cost Is Correct idle screen" onload="this.nextElementSibling.remove()">
        <div class="idle-fallback">The Cost<br>Is Correct</div>
      </section>
    `;
    return;
  }

  const meta = state.currentGame ? getGameMeta(state.currentGame) : { name: titleForPhase(state), colors: ["#ff2f6d", "#00d7ff", "#ffd029"] };
  const game = currentGame;
  const ranked = rankContestants(state.contestants || []);
  const lockedCount = (state.contestants || []).filter((contestant) => contestant.locked).length;
  const leader = ranked[0];
  const screenClass = state.phase === "winner" ? "winner" : "live";
  app.innerHTML = `
    <section class="show-screen ${screenClass}" style="--game-a:${meta.colors[0]};--game-b:${meta.colors[1]};--game-c:${meta.colors[2]}">
      <header class="tv-topline">
        <div class="tv-logo">TCIC</div>
        <div class="game-title">${escapeHtml(titleForPhase(state, meta.name))}</div>
        <div class="timer-orb" data-tv-timer>${timeLeft(state)}</div>
      </header>
      <section class="tv-info-strip">
        <div class="info-pill">ROUND ${Number(state.round || 1)}</div>
        <div class="info-pill">TIMER <span data-tv-timer-copy>${timeLeft(state)}</span></div>
        <div class="info-prize">${escapeHtml(state.product?.name || "Mystery Prize")}</div>
        <div class="info-pill">${state.phase === "reveal" ? `TARGET ${escapeHtml(formatTarget(state.product?.price))}` : "TARGET HIDDEN"}</div>
        <div class="info-pill">${state.buzzersEnabled ? "BUZZERS LIVE" : "BUZZERS CLOSED"}</div>
      </section>
      <section class="tv-main">
        <aside class="leaderboard">${ranked.map(scoreTile).join("")}</aside>
        <section class="game-stack">
          <section class="game-surface">${mainScreenMarkup(state, game)}</section>
          <section class="tv-stat-row">
            <div><span>Leader</span><strong>${escapeHtml(leader?.name || "TBD")}</strong></div>
            <div><span>Locked</span><strong>${lockedCount}/${(state.contestants || []).length}</strong></div>
            <div><span>Phase</span><strong>${escapeHtml(state.phase || "idle")}</strong></div>
            <div><span>Top Score</span><strong>${Number(leader?.score || 0).toLocaleString()}</strong></div>
          </section>
        </section>
      </section>
      <footer class="tv-lower-third">
        <div class="lower-label">${escapeHtml(state.phase === "sponsor" ? "Sponsor" : "Live")}</div>
        <div class="lower-copy">${escapeHtml(state.phase === "sponsor" ? state.sponsor : state.lowerThird)}</div>
        <div class="sponsor-bug">${escapeHtml(state.episodeName || "The Cost Is Correct")}</div>
      </footer>
      ${state.transitionText ? `<div class="transition-burst">${escapeHtml(state.transitionText)}</div>` : ""}
      ${state.revealText ? `<div class="locked-overlay">${escapeHtml(state.revealText)}</div>` : ""}
    </section>
  `;
}

function updateTimer() {
  if (!currentState) return;
  const timer = app.querySelector("[data-tv-timer]");
  if (timer) timer.textContent = timeLeft(currentState);
  const timerCopy = app.querySelector("[data-tv-timer-copy]");
  if (timerCopy) timerCopy.textContent = timeLeft(currentState);
  const bigTimer = app.querySelector("[data-big-timer]");
  if (bigTimer) bigTimer.textContent = timeLeft(currentState);
}

function scoreTile(contestant) {
  return `
    <div class="score-tile ${contestant.locked ? "locked" : ""}" style="--contestant-color:${contestant.color}">
      <div class="contestant-name">${escapeHtml(contestant.name)}</div>
      <div class="score-number">${Number(contestant.score || 0).toLocaleString()}</div>
      <span class="answer-chip">${contestant.locked ? "LOCKED IN" : contestant.answer ? escapeHtml(contestant.answer) : `STREAK ${contestant.streak || 0}`}</span>
    </div>
  `;
}

function winnerMarkup(state) {
  return `
    <section class="tv-production-screen winner-screen">
      <div class="production-kicker">Final Winner</div>
      <div class="winner-name">${escapeHtml(rankContestants(state.contestants || [])[0]?.name || "TBD")}</div>
      <div class="winner-score">${Number(rankContestants(state.contestants || [])[0]?.score || 0).toLocaleString()} POINTS</div>
      <div class="production-subline">${escapeHtml(winnerText(state.contestants || []))}</div>
    </section>
  `;
}

function mainScreenMarkup(state, game) {
  if (state.phase === "scoreboard") return scoreboardMarkup(state);
  if (state.phase === "winner") return winnerMarkup(state);
  if (state.phase === "sponsor") return sponsorMarkup(state);
  if (state.phase === "reveal") return revealMarkup(state);
  if (state.phase === "timer") return timerMarkup(state);
  if (state.phase === "setup") return setupMarkup(state);
  if (state.phase === "wheel") return wheelMarkup(state);
  if (state.phase === "showcase") return showcaseMarkup(state, false);
  if (state.phase === "showcase-reveal") return showcaseMarkup(state, true);
  return game?.renderTV(state) || scoreboardMarkup(state);
}

function scoreboardMarkup(state) {
  const ranked = rankContestants(state.contestants || []);
  return `
    <section class="tv-production-screen scoreboard-screen">
      <div class="production-kicker">Scoreboard</div>
      <div class="scoreboard-list">
        ${ranked.map((contestant, index) => `
          <div class="scoreboard-row" style="--contestant-color:${contestant.color}">
            <span class="place">${index + 1}</span>
            <strong>${escapeHtml(contestant.name)}</strong>
            <b>${Number(contestant.score || 0).toLocaleString()}</b>
            <em>${contestant.locked ? "LOCKED" : `STREAK ${contestant.streak || 0}`}</em>
          </div>
        `).join("")}
      </div>
      <div class="production-subline">Round ${Number(state.round || 1)} • ${escapeHtml(state.episodeName || "The Cost Is Correct")}</div>
    </section>
  `;
}

function sponsorMarkup(state) {
  return `
    <section class="tv-production-screen sponsor-screen">
      <div class="production-kicker">Fake Sponsor Break</div>
      <div class="sponsor-main">${escapeHtml(state.sponsor || "Budget Confetti Labs")}</div>
      <div class="production-subline">This chaotic moment is allegedly brought to you by someone.</div>
    </section>
  `;
}

function revealMarkup(state) {
  return `
    <section class="tv-production-screen reveal-screen">
      <div class="production-kicker">Reveal</div>
      <div class="reveal-target">${escapeHtml(formatTarget(state.product?.price))}</div>
      <div class="production-subline">${escapeHtml(state.product?.name || "Mystery Prize")}</div>
      <div class="answer-reveal-grid">
        ${(state.contestants || []).map((contestant) => `
          <div style="--contestant-color:${contestant.color}">
            <strong>${escapeHtml(contestant.name)}</strong>
            <span>${escapeHtml(contestant.answer || "NO LOCK")}</span>
            <b>${Number(contestant.lastDelta || 0) >= 0 ? "+" : ""}${Number(contestant.lastDelta || 0)}</b>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function timerMarkup(state) {
  return `
    <section class="tv-production-screen timer-screen">
      <div class="production-kicker">Timer</div>
      <div class="big-clock" data-big-timer>${timeLeft(state)}</div>
      <div class="production-subline">${state.timer?.running ? "Clock running" : "Clock paused"} • Round ${Number(state.round || 1)}</div>
    </section>
  `;
}

function setupMarkup(state) {
  return `
    <section class="tv-production-screen setup-screen">
      <div class="production-kicker">Pre-Show Setup</div>
      <div class="setup-roster">
        ${(state.contestants || []).map((contestant) => `
          <div style="--contestant-color:${contestant.color}">
            ${contestant.photo ? `<img src="${escapeHtml(contestant.photo)}" alt="">` : `<span>${escapeHtml((contestant.name || "?").slice(0, 1))}</span>`}
            <strong>${escapeHtml(contestant.name)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="production-subline">${(state.products || []).length} products loaded • ${escapeHtml(state.episodeName || "Episode")}</div>
    </section>
  `;
}

function wheelMarkup(state) {
  const spins = state.wheel?.spins || [];
  const last = spins[spins.length - 1];
  const rotation = Number(state.wheel?.value || 0) * 3.6;
  return `
    <section class="tv-production-screen wheel-screen">
      <div class="production-kicker">The Big Wheel</div>
      <div class="wheel-layout">
        <div class="big-wheel" style="--wheel-rotation:${rotation}deg">
          ${Array.from({ length: 20 }, (_, index) => `<span style="--i:${index}">${(index + 1) * 5}</span>`).join("")}
        </div>
        <div class="wheel-readout">
          <strong>${last ? escapeHtml(last.name) : "Ready"}</strong>
          <b>${last ? `${last.value}` : "SPIN"}</b>
          <em>${last?.value === 100 ? "BONUS!" : "Closest to 100 wins the spin-off"}</em>
        </div>
      </div>
      <div class="wheel-history">${spins.slice(-4).map((spin) => `<span>${escapeHtml(spin.name)} ${spin.value}</span>`).join("")}</div>
    </section>
  `;
}

function showcaseMarkup(state, revealed) {
  const target = state.showcase?.price || state.product?.price || "";
  const winner = showcaseWinner(state, target);
  return `
    <section class="tv-production-screen showcase-screen">
      <div class="production-kicker">${revealed ? "Showcase Reveal" : "Showcase Showdown"}</div>
      <div class="showcase-title">${escapeHtml(state.showcase?.name || state.product?.name || "Ultimate Package")}</div>
      <div class="showcase-price">${revealed ? escapeHtml(formatTarget(target)) : "BID NOW"}</div>
      <div class="answer-reveal-grid">
        ${(state.contestants || []).map((contestant) => {
          const diff = showcaseDiff(contestant.answer, target);
          return `
            <div style="--contestant-color:${contestant.color}">
              <strong>${escapeHtml(contestant.name)}</strong>
              <span>${escapeHtml(contestant.answer || "NO BID")}</span>
              <b>${revealed ? diffLabel(diff) : contestant.locked ? "LOCKED" : "OPEN"}</b>
            </div>
          `;
        }).join("")}
      </div>
      <div class="production-subline">${revealed ? `Winner: ${escapeHtml(winner?.name || "No valid bid")}` : "Closest without going over wins the episode."}</div>
    </section>
  `;
}

function showcaseWinner(state, target) {
  const targetNumber = numericValue(target);
  if (targetNumber === null) return (state.contestants || []).find((contestant) => normalizeText(contestant.answer) === normalizeText(target));
  return (state.contestants || [])
    .map((contestant) => ({ ...contestant, diff: showcaseDiff(contestant.answer, target) }))
    .filter((contestant) => contestant.diff !== null && contestant.diff >= 0)
    .sort((a, b) => a.diff - b.diff)[0];
}

function showcaseDiff(answer, target) {
  const targetNumber = numericValue(target);
  const answerNumber = numericValue(answer);
  if (targetNumber === null || answerNumber === null) return normalizeText(answer) === normalizeText(target) ? 0 : null;
  return targetNumber - answerNumber;
}

function diffLabel(diff) {
  if (diff === null) return "NO MATCH";
  if (diff < 0) return "OVER";
  if (diff === 0) return "EXACT";
  return `${diff} UNDER`;
}

function titleForPhase(state, fallback = "") {
  const titles = {
    scoreboard: "Scoreboard",
    winner: "Winner",
    sponsor: "Sponsor",
    reveal: "Reveal",
    timer: "Timer",
    setup: "Setup",
    wheel: "Big Wheel",
    showcase: "Showcase",
    "showcase-reveal": "Showcase"
  };
  return titles[state.phase] || fallback || "The Cost Is Correct";
}

function numericValue(value) {
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
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
