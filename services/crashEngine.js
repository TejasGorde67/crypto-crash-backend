const crypto = require("crypto");
let currentMultiplier = 1.0;
let crashPoint = 0;
let roundInProgress = false;
let interval = null;

const generateCrashPoint = (seed, roundNumber) => {
  const hash = crypto
    .createHash("sha256")
    .update(seed + roundNumber)
    .digest("hex");
  const hashInt = parseInt(hash.slice(0, 8), 16);
  return parseFloat((1 + (hashInt % 10000) / 100).toFixed(2)); // e.g., 1.00x – 101.00x
};

const startCrashRound = (io) => {
  let roundNumber = 1;

  setInterval(() => {
    if (roundInProgress) return;

    const seed = crypto.randomBytes(16).toString("hex");
    crashPoint = generateCrashPoint(seed, roundNumber);
    currentMultiplier = 1.0;
    roundInProgress = true;

    console.log(`🌀 Starting round ${roundNumber}, crash at ${crashPoint}x`);
    io.emit("round_start", { roundNumber, crashPoint });

    interval = setInterval(() => {
      currentMultiplier += 0.01;
      io.emit("multiplier_update", currentMultiplier.toFixed(2));

      if (currentMultiplier >= crashPoint) {
        clearInterval(interval);
        roundInProgress = false;
        console.log(`💥 Round ${roundNumber} crashed at ${crashPoint}x`);
        io.emit("round_crash", crashPoint.toFixed(2));
        roundNumber++;
      }
    }, 100);
  }, 10000);
};

module.exports = { startCrashRound };
