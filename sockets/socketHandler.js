let currentMultiplier = 1.0;
let crashAt = 0;
let gameInterval;
let round = 1;

function generateCrashPoint() {
  return (Math.random() * 98 + 1.5).toFixed(2);
}

module.exports = (io) => {
  function startGameRound() {
    currentMultiplier = 1.0;
    crashAt = generateCrashPoint();
    console.log(`🌀 Starting round ${round}, crash at ${crashAt}x`);

    gameInterval = setInterval(() => {
      currentMultiplier = (parseFloat(currentMultiplier) + 0.01).toFixed(2);

      io.emit("multiplier", currentMultiplier);

      if (parseFloat(currentMultiplier) >= parseFloat(crashAt)) {
        io.emit("crash", currentMultiplier);
        clearInterval(gameInterval);

        setTimeout(() => {
          round++;
          startGameRound();
        }, 3000);
      }
    }, 100);
  }

  io.on("connection", (socket) => {
    console.log("🔌 New client connected");
    socket.emit("multiplier", currentMultiplier);
  });

  startGameRound();
};
