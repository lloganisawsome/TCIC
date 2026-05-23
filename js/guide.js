import { GAME_CATALOG } from "./games-registry.js";

const HOW_TO_PLAY = {
  "plinko": ["Contestants pick a drop lane and lock a target guess.", "Host hits Drop Chip for the TV animation.", "Reveal scores closest guesses or exact text targets."],
  "cliffhangers": ["Contestants guess the target.", "Host bumps the climber up for suspense.", "Reveal before the climber goes too far."],
  "punch-a-bunch": ["Contestants choose a punch hole or lock a target answer.", "Host triggers punch reveals.", "Award the biggest envelope or closest target."],
  "any-number": ["Contestants submit digits, words, or symbols for the hidden target.", "Use it for car digits, joke prizes, or mystery answers.", "Reveal pays exact or close matches."],
  "card-game": ["Contestants build a bid from card pulls.", "Host can treat the board as draw cards.", "Stop when they want to lock."],
  "clock-game": ["Start the timer.", "Contestants rapid-fire guesses.", "Host uses Higher, Lower, Correct."],
  "danger-price": ["Set one dangerous target.", "Contestants avoid the danger answer.", "Reveal the trap after locks."],
  "dice-game": ["Contestants guess digits or higher/lower calls.", "Use the dice board for each position.", "Reveal scores exact/close target."],
  "easy-as-123": ["Contestants rank items cheapest to most expensive.", "Host uses the 1-2-3 wall.", "Score correct order or closest answer."],
  "five-price-tags": ["Put five possible targets on the TV.", "Contestants pick the right tag.", "Reveal the correct one."],
  "flip-flop": ["Contestants choose flip, flop, both, or neither.", "Host uses the digit machine.", "Reveal the final target."],
  "gas-money": ["Contestants pick wrong prices to bank cash.", "Avoid the real target.", "Reveal each pick for drama."],
  "golden-road": ["Use a chain of increasingly absurd targets.", "Contestants advance by matching each one.", "Great for multi-stage rounds."],
  "grocery-game": ["Set a target total.", "Contestants choose items and quantities verbally or by answer.", "Reveal if they stayed in range."],
  "hi-lo": ["Contestants split items into high and low groups.", "Host uses the shelf wall.", "Reveal the divider."],
  "hole-in-one": ["Contestants order items, then earn a bonus attempt.", "Use the lane TV board.", "Score order plus final target."],
  "its-in-the-bag": ["Contestants match items to bag values.", "Host reveals from low to high.", "Let them stop or risk it."],
  "let-em-roll": ["Contestants earn rolls and chase matching symbols.", "Host treats dice as reveal beats.", "Score car/cash/symbol matches."],
  "line-em-up": ["Contestants align digits or text chunks.", "Host uses the belt machine.", "Reveal correct line."],
  "lucky-seven": ["Contestants protect seven points/dollars.", "Each miss costs the difference.", "Exact target wins big."],
  "money-game": ["Contestants pick number tiles from the board.", "Host marks cash or target pieces.", "Reveal final assembled answer."],
  "now-or-then": ["Contestants decide whether each item belongs to now or then.", "Use exact words as targets too.", "Reveal chain wins."],
  "one-away": ["Every digit or character is one away.", "Contestants adjust and lock.", "Host reveal can be a big horn moment."],
  "pass-the-buck": ["Contestants move the buck to the right item.", "Host reveals board spaces.", "Score cash, lose, or target."],
  "pathfinder": ["Contestants step through a 3x3 target path.", "Wrong steps can trigger penalties.", "Reveal final path."],
  "pay-the-rent": ["Contestants stack items by total value.", "Use floors on TV.", "Reveal from mailbox to attic."],
  "pick-a-pair": ["Contestants find two matching targets.", "Use grocery shelf format.", "Reveal the pair."],
  "push-over": ["Contestants push blocks until the target appears.", "Host controls reveal timing.", "Good for digit or phrase targets."],
  "race-game": ["Start timer and match targets fast.", "Host updates points manually.", "Great for frantic filming."],
  "range-game": ["Contestants stop a moving range window.", "Host freezes and reveals.", "Closest in-range answer scores."],
  "safe-crackers": ["Contestants arrange the code.", "Host spins or opens safe.", "Target can be digits or symbols."],
  "secret-x": ["Contestants place Xs on a grid.", "Host reveals the secret X.", "Score lineups."],
  "shell-game": ["Contestants earn shells and pick where the ball is.", "Host reveals shells.", "Use as luck-plus-price round."],
  "shopping-spree": ["Contestants spend enough target value.", "Host shows cart/lane board.", "Score if total passes threshold."],
  "spelling-bee": ["Contestants collect cards.", "Spell the target word or reveal wildcards.", "Use for CAR or custom words."],
  "squeeze-play": ["Contestants remove the extra digit/character.", "Host reveals squeezed answer.", "Exact target wins."],
  "stack-the-deck": ["Contestants earn helpful target pieces.", "Host flips deck cards.", "Final lock can be full answer."],
  "swap-meet": ["Contestants swap prizes to match values.", "Host reveals matches.", "Score correct swaps."],
  "switcheroo": ["Contestants place blocks against multiple prizes.", "Host can reveal count correct.", "Run it fast with timer."],
  "temptation": ["Contestants receive clue gifts.", "They build the target, then decide risk/reward.", "Reveal all at once."],
  "ten-chances": ["Contestants get ten attempts to build targets.", "Host advances after each miss.", "Great for text and number targets."],
  "thats-too-much": ["Prices climb until contestant calls stop.", "Host reveals whether they stopped in time.", "Use for target thresholds."],
  "time-is-money": ["Contestants sort items while the timer bleeds.", "Host starts/stops timer.", "Score fast correct grouping."],
  "triple-play": ["Three targets in a row.", "Contestants must survive all three.", "Use for big finale energy."]
};

const app = document.getElementById("guideApp");

app.innerHTML = `
  <header class="guide-hero">
    <div>
      <div class="broadcast-bug">GAME BIBLE</div>
      <h1>The Cost Is Correct Game Guide</h1>
      <p>Quick producer notes for what each game does, how to run it, and what the contestant tablet is for.</p>
    </div>
    <nav class="guide-nav">
      <a class="mega-link hot" href="./host.html?v=11">Host Panel</a>
      <a class="mega-link blue" href="./tv.html?v=11">TV Display</a>
      <a class="mega-link gold" href="./tablet.html?host=1&v=11">Host Tablet</a>
    </nav>
  </header>
  <section class="guide-grid">
    ${GAME_CATALOG.map((game, index) => gameCard(game, index)).join("")}
  </section>
`;

function gameCard(game, index) {
  const notes = HOW_TO_PLAY[game.id] || ["Set a target.", "Contestants lock answers.", "Reveal and award points."];
  return `
    <article class="guide-card" style="--game-a:${game.colors[0]};--game-b:${game.colors[1]};--game-c:${game.colors[2]}">
      <div class="guide-number">${String(index + 1).padStart(2, "0")}</div>
      <h2>${escapeHtml(game.name)}</h2>
      <div class="guide-mini-board">${miniBoard(game.id)}</div>
      <ul>
        ${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function miniBoard(id) {
  if (id.includes("card") || id.includes("deck") || id.includes("bee")) return "<span>A</span><span>K</span><span>Q</span>";
  if (id.includes("grocery") || id.includes("hi-lo") || id.includes("pair")) return "<span>CAN</span><span>BOX</span><span>BAG</span>";
  if (id.includes("dice") || id.includes("roll") || id.includes("seven")) return "<span>1</span><span>6</span><span>7</span>";
  if (id.includes("x") || id.includes("path") || id.includes("away")) return "<span>X</span><span>?</span><span>X</span>";
  if (id.includes("money") || id.includes("price") || id.includes("much")) return "<span>$</span><span>?</span><span>!</span>";
  return "<span>LOW</span><span>LOCK</span><span>WIN</span>";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
