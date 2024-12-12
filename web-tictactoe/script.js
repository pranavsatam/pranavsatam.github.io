const cells = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('game-board');
const messageContainer = document.getElementById('message-container');
const messageText = document.getElementById('message-text');
const restartButton = document.getElementById('restart-button');
const fireworksCanvas = document.getElementById('fireworks');

const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let oTurn;
let fireworksAnimation;

// Start the game
startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  oTurn = false;
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.style.pointerEvents = 'all';
    cell.addEventListener('click', handleClick, { once: true });
  });
  messageContainer.classList.add('hidden');
  fireworksCanvas.classList.add('hidden');
  cancelAnimationFrame(fireworksAnimation);
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.innerText = currentClass === X_CLASS ? 'X' : 'O';
  cell.classList.add(currentClass);
}

function endGame(draw) {
  if (draw) {
    messageText.innerText = "It's a Draw!";
  } else {
    messageText.innerText = `${oTurn ? 'O' : 'X'} Wins!`;
    showPopup(oTurn ? 'O' : 'X'); // Show popup after message
    launchFireworks();
  }
  messageContainer.classList.remove('hidden');
  cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
  );
}

function swapTurns() {
  oTurn = !oTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function showPopup(winner) {
  setTimeout(() => {
    alert(`Congratulations ${winner}! You have won the game!`);
  }, 500); // Wait for 0.5 seconds before showing popup
}

function launchFireworks() {
  const ctx = fireworksCanvas.getContext('2d');
  fireworksCanvas.classList.remove('hidden');
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff6b81', '#1e90ff', '#ffdc00'];

  function createFirework(x, y) {
    for (let i = 0; i < 50; i++) {
      particles.push({
        x,
        y,
        radius: Math.random() * 3 + 2,
        speedX: Math.random() * 5 - 2.5,
        speedY: Math.random() * 5 - 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }
  }

  function animateFireworks() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    particles.forEach((particle, index) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(particle.color)},${particle.alpha})`;
      ctx.fill();

      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.alpha -= 0.02;

      if (particle.alpha <= 0) particles.splice(index, 1);
    });

    fireworksAnimation = requestAnimationFrame(animateFireworks);
  }

  createFirework(window.innerWidth / 2, window.innerHeight / 2);
  animateFireworks();
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
