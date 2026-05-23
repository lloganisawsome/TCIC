export const GAME_CATALOG = [
  ["plinko", "Plinko", "#ff2f6d", "#ffd029", "#00d7ff"],
  ["cliffhangers", "Cliff Hangers", "#00a6ff", "#fff1a8", "#4030ff"],
  ["punch-a-bunch", "Punch-a-Bunch", "#ff7a18", "#ff2f6d", "#ffd029"],
  ["any-number", "Any Number", "#00d7ff", "#7f43ff", "#ff2f6d"],
  ["card-game", "Card Game", "#1ecf68", "#0057ff", "#ffd029"],
  ["clock-game", "Clock Game", "#fb003f", "#ffd029", "#00d7ff"],
  ["danger-price", "Danger Price", "#ff003d", "#101018", "#ffd029"],
  ["dice-game", "Dice Game", "#ffffff", "#ff2f6d", "#00d7ff"],
  ["easy-as-123", "Easy as 1 2 3", "#ffd029", "#00d7ff", "#ff2f6d"],
  ["five-price-tags", "Five Price Tags", "#7f43ff", "#ff2f6d", "#ffd029"],
  ["flip-flop", "Flip Flop", "#00d7ff", "#ff7a18", "#ffffff"],
  ["gas-money", "Gas Money", "#1ecf68", "#ffd029", "#101018"],
  ["golden-road", "Golden Road", "#ffd029", "#ff7a18", "#7f43ff"],
  ["grocery-game", "Grocery Game", "#4cff70", "#ff2f6d", "#00d7ff"],
  ["hi-lo", "Hi Lo", "#00d7ff", "#101018", "#ffd029"],
  ["hole-in-one", "Hole in One", "#24e06f", "#ffffff", "#ff2f6d"],
  ["its-in-the-bag", "It's in the Bag", "#ff2f6d", "#7f43ff", "#ffd029"],
  ["let-em-roll", "Let 'Em Roll", "#ffd029", "#00d7ff", "#ff2f6d"],
  ["line-em-up", "Line 'Em Up", "#00d7ff", "#ff2f6d", "#101018"],
  ["lucky-seven", "Lucky $even", "#1ecf68", "#ffd029", "#ff2f6d"],
  ["money-game", "Money Game", "#ffd029", "#1ecf68", "#00d7ff"],
  ["now-or-then", "Now or Then", "#7f43ff", "#00d7ff", "#ffd029"],
  ["one-away", "One Away", "#ff2f6d", "#ffffff", "#00d7ff"],
  ["pass-the-buck", "Pass the Buck", "#1ecf68", "#ffd029", "#ff2f6d"],
  ["pathfinder", "Pathfinder", "#00d7ff", "#48ff65", "#7f43ff"],
  ["pay-the-rent", "Pay the Rent", "#ff7a18", "#ffd029", "#101018"],
  ["pick-a-pair", "Pick-a-Pair", "#ff2f6d", "#00d7ff", "#ffd029"],
  ["push-over", "Push Over", "#7f43ff", "#ff7a18", "#00d7ff"],
  ["race-game", "Race Game", "#fb003f", "#ffd029", "#00d7ff"],
  ["range-game", "Range Game", "#48ff65", "#00d7ff", "#ff2f6d"],
  ["safe-crackers", "Safe Crackers", "#656d83", "#ffd029", "#00d7ff"],
  ["secret-x", "Secret X", "#7f43ff", "#ff2f6d", "#ffffff"],
  ["shell-game", "Shell Game", "#ffd029", "#ff2f6d", "#00d7ff"],
  ["shopping-spree", "Shopping Spree", "#00d7ff", "#48ff65", "#ffd029"],
  ["spelling-bee", "Spelling Bee", "#ffd029", "#7f43ff", "#ff2f6d"],
  ["squeeze-play", "Squeeze Play", "#ff2f6d", "#ffd029", "#00d7ff"],
  ["stack-the-deck", "Stack the Deck", "#101018", "#ff2f6d", "#ffd029"],
  ["swap-meet", "Swap Meet", "#00d7ff", "#ff7a18", "#48ff65"],
  ["switcheroo", "Switcheroo", "#ff2f6d", "#00d7ff", "#ffffff"],
  ["temptation", "Temptation", "#7f43ff", "#ffd029", "#ff2f6d"],
  ["ten-chances", "Ten Chances", "#ffd029", "#00d7ff", "#ff2f6d"],
  ["thats-too-much", "That's Too Much!", "#fb003f", "#ffd029", "#101018"],
  ["time-is-money", "Time is Money", "#48ff65", "#ffd029", "#00d7ff"],
  ["triple-play", "Triple Play", "#00d7ff", "#ff2f6d", "#ffd029"]
].map(([id, name, a, b, c]) => ({
  id,
  name,
  colors: [a, b, c],
  path: `../games/${id}.js`
}));

export async function loadGame(id) {
  const found = GAME_CATALOG.find((game) => game.id === id) || GAME_CATALOG[0];
  const module = await import(found.path);
  return module.default;
}

export function getGameMeta(id) {
  return GAME_CATALOG.find((game) => game.id === id) || GAME_CATALOG[0];
}
