import { patchShow, updateContestant } from "./state.js";

export function rankContestants(contestants = []) {
  return [...contestants].sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
}

export function applyRevealScores(state, game) {
  const scoring = [];
  let contestants = state.contestants || [];
  contestants.forEach((contestant) => {
    if (!contestant.locked) return;
    const points = game.scoreAnswer(contestant.answer, state);
    scoring.push({ id: contestant.id, name: contestant.name, points });
    contestants = updateContestant({ contestants }, contestant.id, (item) => ({
      score: Math.max(0, Number(item.score || 0) + points),
      streak: points > 100 ? Number(item.streak || 0) + 1 : 0,
      lastDelta: points,
      lastReason: "reveal"
    }));
  });
  const max = Math.max(0, ...scoring.map((entry) => entry.points));
  const winners = scoring.filter((entry) => entry.points === max && max > 0).map((entry) => entry.name);
  const totalPoints = scoring.reduce((sum, entry) => sum + entry.points, 0);
  const stats = {
    ...(state.stats || {}),
    reveals: Number(state.stats?.reveals || 0) + 1,
    roundsPlayed: Number(state.stats?.roundsPlayed || 0) + 1,
    totalPointsAwarded: Number(state.stats?.totalPointsAwarded || 0) + totalPoints,
    biggestSwing: Math.max(Number(state.stats?.biggestSwing || 0), max)
  };
  return patchShow({
    contestants,
    stats,
    phase: "reveal",
    revealText: winners.length ? `${winners.join(" + ")} SCORES` : "THE PRICE HAS SPOKEN",
    lowerThird: `Target answer: ${formatTarget(state.product?.price)}`
  });
}

export function winnerText(contestants = []) {
  const ranked = rankContestants(contestants);
  return ranked[0] ? `${ranked[0].name} WINS WITH ${ranked[0].score}` : "NO WINNER YET";
}

export function formatTarget(value) {
  const text = String(value ?? "").trim();
  if (!text) return "mystery";
  if (/^\$/.test(text)) return text;
  if (/^[0-9,.]+$/.test(text)) return `$${text}`;
  return text;
}
