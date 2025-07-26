// sockets/engine.js
let currentMultiplier = 1.0;
let gameInProgress = false;

const startGame = (io) => {
  if (gameInProgress) return;

  gameInProgress = true;
  currentMultiplier = 1.0;
  console.log("🕹️ Game started");

  const interval = setInterval(() => {
    currentMultiplier += 0.01;
    io.emit("multiplier", currentMultiplier.toFixed(2));

    // Random crash point (e.g., 1.5 to 4.0)
    const crashPoint = Math.random() * 2.5 + 1.5;
    if (currentMultiplier >= crashPoint) {
      clearInterval(interval);
      io.emit("crash", currentMultiplier.toFixed(2));
      console.log(`💥 Crashed at x${currentMultiplier.toFixed(2)}`);
      gameInProgress = false;

      // Restart after delay
      setTimeout(() => startGame(io), 3000);
    }
  }, 100); // emit every 100ms
};

module.exports = { startGame };
