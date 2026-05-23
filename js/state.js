export const PRODUCTS = [
  { name: "Suspiciously Premium Air Fryer", price: 189, image: "AF" },
  { name: "Mega Gamer Chair With One Too Many Levers", price: 329, image: "GC" },
  { name: "Tiny Fridge For Very Important Sodas", price: 249, image: "TF" },
  { name: "Robot Vacuum That Has Opinions", price: 418, image: "RV" },
  { name: "Gold-Plated Mystery Blender", price: 136, image: "MB" },
  { name: "Streaming Light Rig Deluxe", price: 279, image: "LR" },
  { name: "Inflatable Hot Tub For Questionable Decisions", price: 599, image: "HT" },
  { name: "Noise-Canceling Headphones Of Destiny", price: 349, image: "HD" }
];

export const DEFAULT_CONTESTANTS = [
  { id: "red", name: "Roxy", color: "#ff2f6d", score: 0, streak: 0, locked: false, answer: "", buzzer: 0 },
  { id: "blue", name: "Blitz", color: "#00d7ff", score: 0, streak: 0, locked: false, answer: "", buzzer: 0 },
  { id: "gold", name: "Cash", color: "#ffd029", score: 0, streak: 0, locked: false, answer: "", buzzer: 0 }
];

const firebaseConfig = {
  apiKey: "AIzaSyCs7P8qBISdmmtIkLJzhPJkHjSSZhoyj_U",
  authDomain: "generaluse-f4fea.firebaseapp.com",
  databaseURL: "https://generaluse-f4fea-default-rtdb.firebaseio.com",
  projectId: "generaluse-f4fea",
  storageBucket: "generaluse-f4fea.firebasestorage.app",
  messagingSenderId: "515153345419",
  appId: "1:515153345419:web:fa6da4eae5527bf64d4d8e",
  measurementId: "G-D831ZJ0ZT8"
};

export const SHOW_ROOT = "the-cost-is-correct/live-show";
const STORAGE_KEY = "tcic.liveShowState";
const CHANNEL_KEY = "tcic-live-show";
const REST_URL = `${firebaseConfig.databaseURL}/${SHOW_ROOT}.json`;
const subscribers = new Set();
const statusSubscribers = new Set();
const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_KEY) : null;
let currentState = readLocalState();
let firebasePromise = null;
let firebaseApi = null;
let applyingRemote = false;
let syncStatus = { mode: "local", online: false, lastWrite: 0, lastRead: 0, error: "" };

export function freshShowState() {
  return {
    version: 1,
    episodeName: "Episode Zero: Price Chaos",
    phase: "idle",
    currentGame: "",
    round: 1,
    lowerThird: "Standing by for price-based nonsense.",
    sponsor: "Fake sponsor: Budget Confetti Labs",
    transitionText: "",
    revealText: "",
    buzzersEnabled: false,
    product: PRODUCTS[0],
    products: PRODUCTS,
    selectedProductIndex: 0,
    wheel: { value: 0, contestantId: "", spins: [] },
    showcase: { name: "Ultimate Chaos Package", price: "2500", revealed: false },
    gameData: {},
    timer: { duration: 30, endsAt: 0, running: false },
    contestants: DEFAULT_CONTESTANTS,
    stats: {
      roundsPlayed: 0,
      reveals: 0,
      totalPointsAwarded: 0,
      biggestSwing: 0,
      episodeStartedAt: Date.now()
    },
    updatedAt: Date.now()
  };
}

export function subscribeShow(callback) {
  subscribers.add(callback);
  callback(currentState);
  ensureFirebase();
  ensureRestPolling();
  return () => subscribers.delete(callback);
}

export function subscribeSyncStatus(callback) {
  statusSubscribers.add(callback);
  callback(syncStatus);
  return () => statusSubscribers.delete(callback);
}

export function replaceShow(state) {
  const next = normalizeState({ ...state, updatedAt: Date.now() });
  commitState(next);
  return writeFirebase(next);
}

export function patchShow(patch) {
  const next = normalizeState({ ...currentState, ...patch, updatedAt: Date.now() });
  commitState(next);
  return writeFirebase(next);
}

export function patchContestants(contestants) {
  return patchShow({ contestants });
}

export function getContestant(state, contestantId) {
  return (state.contestants || []).find((contestant) => contestant.id === contestantId) || state.contestants?.[0];
}

export function updateContestant(state, contestantId, updater) {
  return (state.contestants || []).map((contestant) => {
    if (contestant.id !== contestantId) return contestant;
    return { ...contestant, ...updater(contestant) };
  });
}

export function unlockAll(contestants) {
  return (contestants || []).map((contestant) => ({ ...contestant, locked: false, answer: "", buzzer: 0 }));
}

export function adjustScore(state, contestantId, delta, reason = "manual") {
  const contestants = updateContestant(state, contestantId, (contestant) => ({
    score: Math.max(0, Number(contestant.score || 0) + delta),
    streak: delta > 0 ? Number(contestant.streak || 0) + 1 : 0,
    lastDelta: delta,
    lastReason: reason
  }));
  const stats = {
    ...(state.stats || {}),
    totalPointsAwarded: Number(state.stats?.totalPointsAwarded || 0) + Math.max(0, delta),
    biggestSwing: Math.max(Number(state.stats?.biggestSwing || 0), Math.abs(delta))
  };
  return patchShow({ contestants, stats, transitionText: delta >= 0 ? `+${delta}` : `${delta}` });
}

export function startTimer(seconds = 30) {
  return patchShow({ timer: { duration: seconds, endsAt: Date.now() + seconds * 1000, running: true } });
}

export function stopTimer(state) {
  return patchShow({ timer: { ...(state.timer || {}), running: false, endsAt: 0 } });
}

export function randomProduct() {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
}

export function money(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
}

function readLocalState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeState(saved ? JSON.parse(saved) : freshShowState());
  } catch {
    return freshShowState();
  }
}

function normalizeState(state) {
  const base = freshShowState();
  return {
    ...base,
    ...state,
    timer: { ...base.timer, ...(state?.timer || {}) },
    stats: { ...base.stats, ...(state?.stats || {}) },
    product: state?.product || base.product,
    products: Array.isArray(state?.products) && state.products.length ? state.products : base.products,
    selectedProductIndex: Number.isFinite(Number(state?.selectedProductIndex)) ? Number(state.selectedProductIndex) : base.selectedProductIndex,
    wheel: { ...base.wheel, ...(state?.wheel || {}) },
    showcase: { ...base.showcase, ...(state?.showcase || {}) },
    contestants: Array.isArray(state?.contestants) && state.contestants.length ? state.contestants : base.contestants,
    gameData: state?.gameData || {}
  };
}

function commitState(state, options = {}) {
  currentState = normalizeState(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch {}
  subscribers.forEach((callback) => callback(currentState));
  if (!options.silentBroadcast) {
    channel?.postMessage({ type: "state", state: currentState });
  }
}

function setSyncStatus(patch) {
  syncStatus = { ...syncStatus, ...patch };
  statusSubscribers.forEach((callback) => callback(syncStatus));
}

channel?.addEventListener("message", (event) => {
  if (event.data?.type !== "state") return;
  const next = normalizeState(event.data.state);
  if (Number(next.updatedAt || 0) < Number(currentState.updatedAt || 0)) return;
  commitState(next, { silentBroadcast: true });
});

async function ensureFirebase() {
  if (firebasePromise) return firebasePromise;
  firebasePromise = (async () => {
    try {
      const [appModule, databaseModule, analyticsModule] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js"),
        import("https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js").catch(() => null)
      ]);
      const app = appModule.initializeApp(firebaseConfig);
      if (analyticsModule) {
        analyticsModule.isSupported().then((supported) => {
          if (supported) analyticsModule.getAnalytics(app);
        }).catch(() => {});
      }
      const db = databaseModule.getDatabase(app);
      const showRef = databaseModule.ref(db, SHOW_ROOT);
      firebaseApi = { ...databaseModule, showRef };
      databaseModule.onValue(showRef, async (snapshot) => {
        if (!snapshot.exists()) {
          await databaseModule.set(showRef, { ...currentState, serverUpdatedAt: databaseModule.serverTimestamp() });
          setSyncStatus({ mode: "firebase-sdk", online: true, lastWrite: Date.now(), error: "" });
          return;
        }
        const remote = normalizeState(snapshot.val());
        setSyncStatus({ mode: "firebase-sdk", online: true, lastRead: Date.now(), error: "" });
        if (applyingRemote) return;
        if (Number(remote.updatedAt || 0) >= Number(currentState.updatedAt || 0)) {
          commitState(remote, { silentBroadcast: true });
        }
      });
      return true;
    } catch (error) {
      console.warn("Firebase sync unavailable. Local BroadcastChannel sync is active.", error);
      setSyncStatus({ mode: "rest-fallback", online: false, error: error.message || "Firebase SDK unavailable" });
      return false;
    }
  })();
  return firebasePromise;
}

async function writeFirebase(state) {
  const restWrite = writeRest(state);
  const ready = await withTimeout(ensureFirebase(), 1800, false);
  if (!ready || !firebaseApi) return restWrite;
  applyingRemote = true;
  try {
    await firebaseApi.set(firebaseApi.showRef, {
      ...state,
      serverUpdatedAt: firebaseApi.serverTimestamp()
    });
    setSyncStatus({ mode: "firebase-sdk", online: true, lastWrite: Date.now(), error: "" });
    return true;
  } catch (error) {
    console.warn("Firebase write failed. Local sync remains active.", error);
    setSyncStatus({ mode: "rest-fallback", online: false, error: error.message || "Firebase SDK write failed" });
    return restWrite;
  } finally {
    applyingRemote = false;
  }
}

async function writeRest(state) {
  try {
    const response = await fetch(REST_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, serverUpdatedAt: Date.now() })
    });
    if (!response.ok) throw new Error(`REST write ${response.status}`);
    setSyncStatus({ mode: "firebase-rest", online: true, lastWrite: Date.now(), error: "" });
    return true;
  } catch (error) {
    console.warn("Firebase REST write failed. Local sync remains active.", error);
    setSyncStatus({ mode: "local-only", online: false, error: error.message || "REST write failed" });
    return false;
  }
}

let restPollStarted = false;
function ensureRestPolling() {
  if (restPollStarted) return;
  restPollStarted = true;
  readRest();
  setInterval(readRest, 2500);
}

async function readRest() {
  try {
    const response = await fetch(`${REST_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`REST read ${response.status}`);
    const remote = await response.json();
    if (!remote) return;
    const next = normalizeState(remote);
    setSyncStatus({ mode: syncStatus.mode === "firebase-sdk" ? "firebase-sdk" : "firebase-rest", online: true, lastRead: Date.now(), error: "" });
    if (Number(next.updatedAt || 0) > Number(currentState.updatedAt || 0)) {
      commitState(next, { silentBroadcast: true });
    }
  } catch (error) {
    setSyncStatus({ online: false, error: error.message || "REST read failed" });
  }
}

function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}
