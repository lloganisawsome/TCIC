export function makePricingGame(config) {
  const cfg = {
    mode: "tiles",
    instruction: "Guess the price, lock it in, and let the host make it weird.",
    ...config
  };

  return {
    id: cfg.id,
    name: cfg.name,
    colors: cfg.colors,
    instruction: cfg.instruction,
    makeInitialData(state = {}) {
      return {
        step: 0,
        target: state.product?.price || 299,
        selected: "",
        board: defaultBoard(cfg.mode),
        ...cfg.initialData
      };
    },
    renderTV(state) {
      if (cfg.renderTV) return cfg.renderTV(state, cfg);
      return genericTV(state, cfg);
    },
    renderHost(state) {
      if (cfg.renderHost) return cfg.renderHost(state, cfg);
      return genericHost(state, cfg);
    },
    renderTablet(state, contestant) {
      if (cfg.renderTablet) return cfg.renderTablet(state, contestant, cfg);
      return genericTablet(state, contestant, cfg);
    },
    scoreAnswer(answer, state) {
      if (cfg.scoreAnswer) return cfg.scoreAnswer(answer, state, cfg);
      const targetText = String(state.product?.price ?? "").trim();
      const answerText = String(answer ?? "").trim();
      const price = numericValue(targetText);
      const guess = numericValue(answerText);
      if (price === null || guess === null) {
        if (!answerText) return 0;
        if (normalizeText(answerText) === normalizeText(targetText)) return 1000;
        if (normalizeText(answerText).includes(normalizeText(targetText)) || normalizeText(targetText).includes(normalizeText(answerText))) return 400;
        return 50;
      }
      const diff = Math.abs(price - guess);
      if (diff === 0) return 1000;
      if (diff <= 10) return 700;
      if (diff <= 50) return 400;
      if (diff <= 100) return 200;
      return 50;
    },
    hostActions: cfg.hostActions || [
      { id: "chaos", label: "Chaos Beat", patch: { transitionText: "CHAOS BEAT", lowerThird: "The audience has been instructed to overreact." } },
      { id: "lock", label: "Locked In Blast", patch: { revealText: "LOCKED IN" } }
    ]
  };
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

function defaultBoard(mode) {
  if (mode === "cards") return ["A", "2", "3", "4", "5", "6", "7", "8"];
  if (mode === "digits") return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  if (mode === "choices") return ["$99", "$149", "$249", "$399", "$599", "$799"];
  return ["LOW", "HIGH", "LEFT", "RIGHT", "YES", "NO", "WILD", "BONUS"];
}

function genericTV(state, cfg) {
  const board = state.gameData?.board || defaultBoard(cfg.mode);
  const id = cfg.id || "";
  if (["card-game", "spelling-bee", "stack-the-deck"].includes(id)) return cardTable(board, cfg);
  if (["grocery-game", "hi-lo", "pick-a-pair"].includes(id)) return groceryShelf(board, cfg);
  if (["easy-as-123", "danger-price", "five-price-tags"].includes(id)) return priceTagWall(board, cfg);
  if (["gas-money", "pass-the-buck", "golden-road"].includes(id)) return roadShow(board, cfg);
  if (["dice-game", "let-em-roll", "lucky-seven"].includes(id)) return diceCasino(board, cfg);
  if (["hole-in-one", "shopping-spree", "race-game"].includes(id)) return actionLanes(board, cfg);
  if (["its-in-the-bag", "pay-the-rent", "temptation"].includes(id)) return stackedPrizes(board, cfg);
  if (["pathfinder", "secret-x", "one-away"].includes(id)) return gridPuzzle(board, cfg);
  if (["push-over", "squeeze-play", "line-em-up", "switcheroo", "flip-flop"].includes(id)) return digitMachine(board, cfg);
  if (["now-or-then", "thats-too-much", "time-is-money", "triple-play", "swap-meet", "shell-game", "ten-chances", "any-number"].includes(id)) return specialtyStage(board, cfg);
  return `
    <section class="generic-grid format-default">
      ${board.map((item, index) => `<div class="generic-card" style="animation-delay:${index * .08}s">${item}</div>`).join("")}
    </section>
  `;
}

function cardTable(board, cfg) {
  return `
    <section class="game-format card-table">
      <div class="format-marquee">${cfg.name}</div>
      <div class="card-fan">${board.map((item, index) => `<div class="show-card" style="--i:${index}">${item}</div>`).join("")}</div>
      <div class="format-callout">Draw. Decide. Commit.</div>
    </section>
  `;
}

function groceryShelf(board, cfg) {
  return `
    <section class="game-format grocery-shelf">
      <div class="format-marquee">${cfg.name}</div>
      <div class="shelf-grid">${board.slice(0, 6).map((item, index) => `<div class="shelf-item"><b>${item}</b><span>ITEM ${index + 1}</span></div>`).join("")}</div>
      <div class="shelf-rail">High / Low / Pair check</div>
    </section>
  `;
}

function priceTagWall(board, cfg) {
  return `
    <section class="game-format tag-wall">
      <div class="format-marquee">${cfg.name}</div>
      <div class="tag-row">${board.slice(0, 5).map((item, index) => `<div class="price-tag"><span>TAG ${index + 1}</span><b>${item}</b></div>`).join("")}</div>
      <div class="danger-plaque">Pick carefully</div>
    </section>
  `;
}

function roadShow(board, cfg) {
  return `
    <section class="game-format road-show">
      <div class="road-line"></div>
      <div class="format-marquee">${cfg.name}</div>
      <div class="road-signs">${board.slice(0, 6).map((item, index) => `<div class="road-sign" style="--i:${index}">${item}</div>`).join("")}</div>
    </section>
  `;
}

function diceCasino(board, cfg) {
  return `
    <section class="game-format dice-casino">
      <div class="format-marquee">${cfg.name}</div>
      <div class="dice-row">${board.slice(0, 5).map((item, index) => `<div class="show-die" style="--i:${index}">${item}</div>`).join("")}</div>
      <div class="seven-meter"><span></span><b>LUCK METER</b><span></span></div>
    </section>
  `;
}

function actionLanes(board, cfg) {
  return `
    <section class="game-format action-lanes">
      <div class="format-marquee">${cfg.name}</div>
      <div class="lane-track">${board.slice(0, 4).map((item, index) => `<div class="race-lane"><span>LANE ${index + 1}</span><b>${item}</b></div>`).join("")}</div>
      <div class="finish-line">FINISH</div>
    </section>
  `;
}

function stackedPrizes(board, cfg) {
  return `
    <section class="game-format stacked-prizes">
      <div class="format-marquee">${cfg.name}</div>
      <div class="rent-tower">${board.slice(0, 5).map((item, index) => `<div class="tower-floor"><span>FLOOR ${5 - index}</span><b>${item}</b></div>`).join("")}</div>
    </section>
  `;
}

function gridPuzzle(board, cfg) {
  return `
    <section class="game-format puzzle-grid">
      <div class="format-marquee">${cfg.name}</div>
      <div class="x-grid">${Array.from({ length: 9 }, (_, index) => `<div class="x-cell">${board[index % board.length]}</div>`).join("")}</div>
    </section>
  `;
}

function digitMachine(board, cfg) {
  return `
    <section class="game-format digit-machine">
      <div class="format-marquee">${cfg.name}</div>
      <div class="digit-belt">${board.slice(0, 8).map((item, index) => `<div class="belt-block" style="--i:${index}">${item}</div>`).join("")}</div>
      <div class="machine-window">Move the numbers</div>
    </section>
  `;
}

function specialtyStage(board, cfg) {
  return `
    <section class="game-format specialty-stage">
      <div class="format-marquee">${cfg.name}</div>
      <div class="special-orbit">${board.slice(0, 6).map((item, index) => `<div class="orbit-card" style="--i:${index}">${item}</div>`).join("")}</div>
      <div class="format-callout">${cfg.instruction}</div>
    </section>
  `;
}

function genericHost(state, cfg) {
  const actions = cfg.hostActions || [
    { id: "reveal", label: `${cfg.name} Reveal`, tone: "hot" },
    { id: "randomize", label: "Randomize Product", tone: "blue" },
    { id: "lockblast", label: "Locked In Blast", tone: "gold" }
  ];
  return `
    <div class="host-controls">
      ${actions.map((action) => `<button class="shock-button ${action.tone || "blue"}" data-game-action="${action.id}">${action.label}</button>`).join("")}
    </div>
  `;
}

function genericTablet(state, contestant, cfg) {
  return `
    <div class="tablet-form">
      <div class="tablet-prompt">${cfg.instruction}</div>
      <input class="tablet-input" inputmode="text" data-answer-input placeholder="$??? / FREE / ⭐"
        value="${escapeHtml(contestant?.answer || "")}">
      <button class="tablet-button ${contestant?.locked ? "locked" : ""}" data-lock-answer>
        ${contestant?.locked ? "Locked In" : "Lock It"}
      </button>
      <div class="tablet-pills">
        <button class="pill-button" data-quick-answer="LOW">LOW</button>
        <button class="pill-button" data-quick-answer="HIGH">HIGH</button>
        <button class="pill-button" data-buzzer>BUZZ</button>
      </div>
    </div>
  `;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
