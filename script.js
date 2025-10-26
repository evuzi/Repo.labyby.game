// --- СЛОТ ---
const symbols = ["🍒", "🍋", "💎", "⭐", "🔔"];
const payouts = { "🍒": 5, "🍋": 10, "💎": 50, "⭐": 100, "🔔": 20 };

let balance = 5000;
let bet = 100;

const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');
const messageEl = document.getElementById('message');

function fillReel(i) {
  const c = document.getElementById('symbols' + i);
  c.innerHTML = '';
  for (let j = 0; j < 8; j++) {
    const s = document.createElement('div');
    s.className = 'symbol';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    c.appendChild(s);
  }
}
[0, 1, 2].forEach(fillReel);

document.getElementById('dec').onclick = () => { if (bet > 10) { bet -= 10; betEl.textContent = bet } };
document.getElementById('inc').onclick = () => { bet += 10; betEl.textContent = bet };

function spin() {
  if (bet > balance) { messageEl.textContent = 'Недостаточно средств'; return; }
  balance -= bet; balanceEl.textContent = balance; messageEl.textContent = 'Крутим...';

  const res = [];
  for (let r = 0; r < 3; r++) {
    const t = symbols[Math.floor(Math.random() * symbols.length)];
    res.push(t);
    const c = document.getElementById('symbols' + r);
    c.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'symbol';
      d.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      c.appendChild(d);
    }
    const center = document.createElement('div');
    center.className = 'symbol';
    center.textContent = t;
    c.appendChild(center);
    c.style.transition = 'none';
    c.style.transform = 'translateY(0)';
    setTimeout(() => {
      c.style.transition = 'transform 1s ease';
      c.style.transform = 'translateY(-660px)';
    }, r * 150);
  }

  setTimeout(() => {
    if (res[0] === res[1] && res[1] === res[2]) {
      const win = payouts[res[0]] * bet / 10;
      balance += win;
      balanceEl.textContent = balance;
      messageEl.textContent = 'Вы выиграли ' + win + ' ₽!';
    } else messageEl.textContent = 'Попробуйте снова!';
  }, 1500);
}
document.getElementById('spin').onclick = spin;

// --- ВЫВОД ДЕНЕГ ---
const modal = document.getElementById('modal');
document.getElementById('withdraw').onclick = () => { modal.style.display = 'flex'; };
document.getElementById('closeModal').onclick = () => { modal.style.display = 'none'; };
document.getElementById('confirmWithdraw').onclick = () => {
  const amt = parseInt(document.getElementById('amount').value);
  const card = document.getElementById('card').value.trim();
  const msg = document.getElementById('withdrawMsg');
  if (!amt || amt < 100) { msg.textContent = '⚠️ Минимум 100 ₽'; return; }
  if (amt > balance) { msg.textContent = '❌ Недостаточно средств'; return; }
  if (!/^[0-9]{16}$/.test(card.replace(/\s/g, ''))) { msg.textContent = '⚠️ Некорректная карта'; return; }
  msg.textContent = '⏳ Обработка...';
  setTimeout(() => { msg.textContent = '⚠️ Вывод доступен от 1,000,000 ₽ 😅'; }, 1200);
};

// --- САПЁР ---
const grid = document.getElementById('grid');
const scoreEl = document.getElementById('score');
const mineMsg = document.getElementById('mineMsg');
const newGameBtn = document.getElementById('newGame');

let cells = [], score = 0, gameOver = false;
function createGrid() {
  grid.innerHTML = '';
  cells = [];
  score = 0;
  scoreEl.textContent = score;
  mineMsg.textContent = 'Найди все безопасные клетки!';
  gameOver = false;
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const isBomb = Math.random() < 0.15;
    cells.push({ el: cell, bomb: isBomb, revealed: false });
    cell.onclick = () => revealCell(i);
    grid.appendChild(cell);
  }
}
function revealCell(i) {
  if (gameOver || cells[i].revealed) return;
  const c = cells[i];
  c.revealed = true;
  if (c.bomb) {
    c.el.classList.add('bomb');
    mineMsg.textContent = '💥 Бомба! Игра окончена.';
    gameOver = true;
  } else {
    c.el.classList.add('revealed');
    score += 10;
    scoreEl.textContent = score;
    mineMsg.textContent = '✅ Отлично! Продолжай!';
  }
}
newGameBtn.onclick = createGrid;
createGrid();
