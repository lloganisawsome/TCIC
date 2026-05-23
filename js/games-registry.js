export const GAME_CATALOG = [
  ["plinko", "Plinko", "#ff2f6d", "#ffd029", "#00d7ff", "plinko"],
  ["cliffhangers", "Cliff Hangers", "#00a6ff", "#fff1a8", "#4030ff", "mountain"],
  ["punch-a-bunch", "Punch-a-Bunch", "#ff7a18", "#ff2f6d", "#ffd029", "punch"],
  ["any-number", "Any Number", "#00d7ff", "#7f43ff", "#ff2f6d", "digits"],
  ["card-game", "Card Game", "#1ecf68", "#0057ff", "#ffd029", "cards"],
  ["clock-game", "Clock Game", "#fb003f", "#ffd029", "#00d7ff", "clock"],
  ["danger-price", "Danger Price", "#ff003d", "#101018", "#ffd029", "tags"],
  ["dice-game", "Dice Game", "#ffffff", "#ff2f6d", "#00d7ff", "dice"],
  ["easy-as-123", "Easy as 1 2 3", "#ffd029", "#00d7ff", "#ff2f6d", "tags"],
  ["five-price-tags", "Five Price Tags", "#7f43ff", "#ff2f6d", "#ffd029", "tags"],
  ["flip-flop", "Flip Flop", "#00d7ff", "#ff7a18", "#ffffff", "machine"],
  ["gas-money", "Gas Money", "#1ecf68", "#ffd029", "#101018", "road"],
  ["golden-road", "Golden Road", "#ffd029", "#ff7a18", "#7f43ff", "road"],
  ["grocery-game", "Grocery Game", "#4cff70", "#ff2f6d", "#00d7ff", "shelf"],
  ["hi-lo", "Hi Lo", "#00d7ff", "#101018", "#ffd029", "shelf"],
  ["hole-in-one", "Hole in One", "#24e06f", "#ffffff", "#ff2f6d", "lanes"],
  ["its-in-the-bag", "It's in the Bag", "#ff2f6d", "#7f43ff", "#ffd029", "tower"],
  ["let-em-roll", "Let 'Em Roll", "#ffd029", "#00d7ff", "#ff2f6d", "dice"],
  ["line-em-up", "Line 'Em Up", "#00d7ff", "#ff2f6d", "#101018", "machine"],
  ["lucky-seven", "Lucky $even", "#1ecf68", "#ffd029", "#ff2f6d", "dice"],
  ["money-game", "Money Game", "#ffd029", "#1ecf68", "#00d7ff", "money"],
  ["now-or-then", "Now or Then", "#7f43ff", "#00d7ff", "#ffd029", "orbit"],
  ["one-away", "One Away", "#ff2f6d", "#ffffff", "#00d7ff", "grid"],
  ["pass-the-buck", "Pass the Buck", "#1ecf68", "#ffd029", "#ff2f6d", "road"],
  ["pathfinder", "Pathfinder", "#00d7ff", "#48ff65", "#7f43ff", "grid"],
  ["pay-the-rent", "Pay the Rent", "#ff7a18", "#ffd029", "#101018", "tower"],
  ["pick-a-pair", "Pick-a-Pair", "#ff2f6d", "#00d7ff", "#ffd029", "shelf"],
  ["push-over", "Push Over", "#7f43ff", "#ff7a18", "#00d7ff", "machine"],
  ["race-game", "Race Game", "#fb003f", "#ffd029", "#00d7ff", "lanes"],
  ["range-game", "Range Game", "#48ff65", "#00d7ff", "#ff2f6d", "range"],
  ["safe-crackers", "Safe Crackers", "#656d83", "#ffd029", "#00d7ff", "safe"],
  ["secret-x", "Secret X", "#7f43ff", "#ff2f6d", "#ffffff", "grid"],
  ["shell-game", "Shell Game", "#ffd029", "#ff2f6d", "#00d7ff", "orbit"],
  ["shopping-spree", "Shopping Spree", "#00d7ff", "#48ff65", "#ffd029", "lanes"],
  ["spelling-bee", "Spelling Bee", "#ffd029", "#7f43ff", "#ff2f6d", "cards"],
  ["squeeze-play", "Squeeze Play", "#ff2f6d", "#ffd029", "#00d7ff", "machine"],
  ["stack-the-deck", "Stack the Deck", "#101018", "#ff2f6d", "#ffd029", "cards"],
  ["swap-meet", "Swap Meet", "#00d7ff", "#ff7a18", "#48ff65", "orbit"],
  ["switcheroo", "Switcheroo", "#ff2f6d", "#00d7ff", "#ffffff", "machine"],
  ["temptation", "Temptation", "#7f43ff", "#ffd029", "#ff2f6d", "tower"],
  ["ten-chances", "Ten Chances", "#ffd029", "#00d7ff", "#ff2f6d", "orbit"],
  ["thats-too-much", "That's Too Much!", "#fb003f", "#ffd029", "#101018", "orbit"],
  ["time-is-money", "Time is Money", "#48ff65", "#ffd029", "#00d7ff", "orbit"],
  ["triple-play", "Triple Play", "#00d7ff", "#ff2f6d", "#ffd029", "orbit"]
].map(([id, name, a, b, c, layout]) => ({
  id,
  name,
  layout,
  colors: [a, b, c]
}));

const BOARDS = {
  cards: ["A", "2", "3", "4", "5", "WILD"],
  dice: ["1", "2", "3", "4", "5", "6"],
  shelf: ["CAN", "BOX", "BAG", "JAR", "TIN", "BOTTLE"],
  tags: ["$99", "$149", "$249", "$399", "$599"],
  road: ["STOP", "PASS", "CASH", "CAR", "BUCK"],
  grid: ["X", "?", "X", "?", "WIN", "?"],
  machine: ["1", "2", "3", "4", "5", "6", "7", "8"],
  tower: ["MAIL", "1ST", "2ND", "ATTIC", "BONUS"],
  lanes: ["LANE 1", "LANE 2", "LANE 3", "LANE 4"],
  orbit: ["LOW", "HIGH", "LOCK", "SWAP", "WIN", "WILD"],
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
};

export async function loadGame(id) {
  return createBuiltInGame(getGameMeta(id));
}

export function getGameMeta(id) {
  return GAME_CATALOG.find((game) => game.id === id) || GAME_CATALOG[0];
}

function createBuiltInGame(meta) {
  return {
    id: meta.id,
    name: meta.name,
    colors: meta.colors,
    instruction: instructionFor(meta),
    makeInitialData(state = {}) {
      return {
        target: state.product?.price || "",
        board: boardFor(meta),
        chipX: 48,
        chipY: 5,
        slots: [0, 100, 500, 1000, 500, 100],
        steps: 8,
        feedback: "READY"
      };
    },
    renderTV(state) {
      return renderLayout(meta, state);
    },
    renderHost() {
      return '<div class="host-controls">' +
        '<button class="shock-button hot" data-game-action="reveal">' + meta.name + ' Reveal</button>' +
        '<button class="shock-button gold" data-game-action="lockblast">Locked In Blast</button>' +
        '<button class="shock-button blue" data-game-action="randomize">Randomize Product</button>' +
      '</div>';
    },
    renderTablet(state, contestant) {
      return '<div class="tablet-form">' +
        '<div class="tablet-prompt">' + escapeHtml(instructionFor(meta)) + '</div>' +
        '<input class="tablet-input" inputmode="text" data-answer-input placeholder="$??? / FREE / ?" value="' + escapeHtml(contestant?.answer || "") + '">' +
        '<button class="tablet-button ' + (contestant?.locked ? "locked" : "") + '" data-lock-answer>' + (contestant?.locked ? "Locked In" : "Lock It") + '</button>' +
        '<div class="tablet-pills"><button class="pill-button" data-quick-answer="LOW">LOW</button><button class="pill-button" data-quick-answer="HIGH">HIGH</button><button class="pill-button" data-buzzer>BUZZ</button></div>' +
      '</div>';
    },
    scoreAnswer(answer, state) {
      const target = String(state.product?.price || "");
      const targetNumber = numberFrom(target);
      const answerNumber = numberFrom(answer);
      if (targetNumber === null || answerNumber === null) return normalize(answer) === normalize(target) ? 1000 : 50;
      const diff = Math.abs(targetNumber - answerNumber);
      if (diff === 0) return 1000;
      if (diff <= 10) return 700;
      if (diff <= 50) return 400;
      if (diff <= 100) return 200;
      return 50;
    }
  };
}

function instructionFor(meta) {
  const map = {
    plinko: "Pick a lane, guess the target, then drop the chip.",
    cliffhangers: "Guess the target. Every miss sends the climber higher.",
    "punch-a-bunch": "Pick a punch hole and reveal the prize.",
    "clock-game": "Guess fast while the host calls higher, lower, or correct.",
    "range-game": "Stop the moving range window over the target.",
    "safe-crackers": "Arrange the code and crack the safe."
  };
  return map[meta.id] || "Lock an answer for this pricing board, then let the host reveal the result.";
}

function boardFor(meta) {
  if (meta.id === "money-game") return ["19", "24", "35", "42", "58", "67", "73", "80", "96", "01", "12", "99"];
  return BOARDS[meta.layout] || BOARDS.orbit;
}

function renderLayout(meta, state) {
  if (meta.layout === "plinko") return renderPlinko(state);
  if (meta.layout === "mountain") return '<section class="mountain-game" style="--steps:' + Number(state.gameData?.steps || 8) + '"><div class="mountain"></div><div class="climber"></div></section>';
  if (meta.layout === "punch") return '<section class="punch-grid">' + Array.from({ length: 10 }, (_, i) => '<div class="punch-hole">$' + ([50,250,1000,25,500,2000,100,10000,75,750][i]) + '</div>').join("") + '</section>';
  if (meta.layout === "clock") return '<section class="generic-grid"><div class="generic-card">30 SEC</div><div class="clock-feedback">' + escapeHtml(state.gameData?.feedback || "READY") + '</div><div class="generic-card">' + escapeHtml(state.product?.name || "Mystery") + '</div></section>';
  if (meta.layout === "safe") return '<section class="safe-dial-wrap"><div class="safe-dial"></div></section>';
  if (meta.layout === "money") return renderBoard("number-board", boardFor(meta), "money-tile");
  if (meta.layout === "range") return '<section class="range-track"><div class="generic-card">STOP THE WINDOW</div><div class="range-bar"><div class="range-window"></div></div><div class="generic-card">$100 .......... $900</div></section>';
  const cls = {
    cards: "card-table", shelf: "grocery-shelf", tags: "tag-wall", road: "road-show", dice: "dice-casino",
    lanes: "action-lanes", tower: "stacked-prizes", grid: "puzzle-grid", machine: "digit-machine", orbit: "specialty-stage", digits: "digit-machine"
  }[meta.layout] || "specialty-stage";
  return '<section class="game-format ' + cls + '"><div class="format-marquee">' + escapeHtml(meta.name) + '</div>' + renderSimpleBoard(meta) + '<div class="format-callout">' + escapeHtml(instructionFor(meta)) + '</div></section>';
}

function renderPlinko(state) {
  const pegs = Array.from({ length: 63 }, () => '<span class="peg"></span>').join("");
  const slots = (state.gameData?.slots || [0,100,500,1000,500,100]).map((slot) => '<div class="slot">$' + slot + '</div>').join("");
  return '<section class="plinko-board"><div class="peg-field">' + pegs + '<div class="plinko-chip" style="--chip-x:' + (state.gameData?.chipX || 48) + ';--chip-y:' + (state.gameData?.chipY || 4) + '"></div></div><div class="slots">' + slots + '</div></section>';
}

function renderSimpleBoard(meta) {
  const board = boardFor(meta);
  if (meta.layout === "cards") return '<div class="card-fan">' + board.map((x, i) => '<div class="show-card" style="--i:' + i + '">' + escapeHtml(x) + '</div>').join("") + '</div>';
  if (meta.layout === "shelf") return '<div class="shelf-grid">' + board.map((x, i) => '<div class="shelf-item"><b>' + escapeHtml(x) + '</b><span>ITEM ' + (i + 1) + '</span></div>').join("") + '</div>';
  if (meta.layout === "tags") return '<div class="tag-row">' + board.map((x, i) => '<div class="price-tag"><span>TAG ' + (i + 1) + '</span><b>' + escapeHtml(x) + '</b></div>').join("") + '</div>';
  if (meta.layout === "dice") return '<div class="dice-row">' + board.map((x, i) => '<div class="show-die" style="--i:' + i + '">' + escapeHtml(x) + '</div>').join("") + '</div>';
  if (meta.layout === "lanes") return '<div class="lane-track">' + board.map((x, i) => '<div class="race-lane"><span>LANE ' + (i + 1) + '</span><b>' + escapeHtml(x) + '</b></div>').join("") + '</div>';
  if (meta.layout === "tower") return '<div class="rent-tower">' + board.map((x, i) => '<div class="tower-floor"><span>FLOOR ' + (board.length - i) + '</span><b>' + escapeHtml(x) + '</b></div>').join("") + '</div>';
  if (meta.layout === "grid") return '<div class="x-grid">' + Array.from({ length: 9 }, (_, i) => '<div class="x-cell">' + escapeHtml(board[i % board.length]) + '</div>').join("") + '</div>';
  if (meta.layout === "machine" || meta.layout === "digits") return '<div class="digit-belt">' + board.map((x, i) => '<div class="belt-block" style="--i:' + i + '">' + escapeHtml(x) + '</div>').join("") + '</div>';
  if (meta.layout === "road") return '<div class="road-line"></div><div class="road-signs">' + board.map((x, i) => '<div class="road-sign" style="--i:' + i + '">' + escapeHtml(x) + '</div>').join("") + '</div>';
  return '<div class="special-orbit">' + board.map((x, i) => '<div class="orbit-card" style="--i:' + i + '">' + escapeHtml(x) + '</div>').join("") + '</div>';
}

function renderBoard(sectionClass, board, itemClass) {
  return '<section class="' + sectionClass + '">' + board.map((x, i) => '<div class="' + itemClass + '" style="--tilt:' + (i % 2 ? -2 : 2) + 'deg">' + escapeHtml(x) + '</div>').join("") + '</section>';
}

function numberFrom(value) {
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
