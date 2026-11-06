// Mini games: Tic-Tac-Toe (vs computer) and Memory Match

// ----- Tic-Tac-Toe -----
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let t, tOver;
const win = (b, p) => LINES.some(l => l.every(i => b[i] === p));

function tDraw(){
  $("board").innerHTML = t.map((v, i) =>
    `<button class="cell" data-i="${i}" aria-label="Cell ${i + 1} ${v || "empty"}">${v}</button>`).join("");
}
function tReset(){ t = Array(9).fill(""); tOver = false; $("tstat").textContent = "You are ✕. Your move."; tDraw(); }
function cpu(){
  const free = t.map((v, i) => v ? null : i).filter(i => i !== null);
  for (const p of ["O", "X"]) for (const i of free){ const c = [...t]; c[i] = p; if (win(c, p)) return i; }
  if (!t[4]) return 4;
  return free[Math.floor(Math.random() * free.length)];
}
$("board").addEventListener("click", e => {
  const b = e.target.closest(".cell"); if (!b || tOver) return;
  const i = +b.dataset.i; if (t[i]) return;
  t[i] = "X";
  if (win(t, "X")){ tOver = true; $("tstat").textContent = "You win! 🎉"; }
  else if (t.every(Boolean)){ tOver = true; $("tstat").textContent = "It’s a draw."; }
  else {
    t[cpu()] = "O";
    if (win(t, "O")){ tOver = true; $("tstat").textContent = "I win this one 😎"; }
    else if (t.every(Boolean)){ tOver = true; $("tstat").textContent = "It’s a draw."; }
  }
  tDraw();
});
$("treset").onclick = tReset; tReset();

// ----- Memory Match -----
let cards, open, matched, moves, lock;
function mReset(){
  const e = ["⚛️","🎨","🚀","💻","🔥","🎮","⭐","🧠"];
  cards = [...e, ...e].sort(() => Math.random() - .5);
  open = []; matched = new Set(); moves = 0; lock = false;
  $("mstat").textContent = "Find all the pairs."; mDraw();
}
function mDraw(){
  $("mem").innerHTML = cards.map((c, i) => {
    const up = open.includes(i) || matched.has(i);
    return `<button class="mc ${matched.has(i) ? "done" : up ? "up" : ""}" data-i="${i}" aria-label="${up ? c : "Hidden card"}">${up ? c : "❓"}</button>`;
  }).join("");
}
$("mem").addEventListener("click", e => {
  const b = e.target.closest(".mc"); if (!b || lock) return;
  const i = +b.dataset.i; if (open.includes(i) || matched.has(i)) return;
  open.push(i); mDraw();
  if (open.length === 2){
    moves++; lock = true;
    const [a, c] = open;
    setTimeout(() => {
      if (cards[a] === cards[c]){ matched.add(a); matched.add(c); }
      open = []; lock = false; mDraw();
      $("mstat").textContent = matched.size === 16 ? `Done in ${moves} moves! 🎉` : `Moves: ${moves}`;
    }, 700);
  }
});
$("mreset").onclick = mReset; mReset();
