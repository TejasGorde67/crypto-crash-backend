const crypto = require("crypto");
const Round = require("../models/Round");

let currentMultiplier = 1.0;
let currentRound = null;
let crashPoint = null;
let roundInProgress = false;
let growthRate = 0.02; // multiplier increase rate
let roundNumber = 0;

// Provably fair crash point generator
function getCrashPoint(seed, roundNumber) {
  const hash = crypto
    .createHash("sha256")
    .update(seed + roundNumber)
    .digest("hex");
  const decimal = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
  return Math.max(1.01, Math.floor(decimal * 100 * 100) / 100); // 1.01x to 100x
}

module.exports = function startGameEngine(io) {
  setInterval(async () => {
    if (roundInProgress) return;

    // 🟢 New round setup
    roundInProgress = true;
    currentMultiplier = 1.0;
    roundNumber += 1;

    const serverSeed = crypto.randomBytes(16).toString("hex");
    crashPoint = getCrashPoint(serverSeed, roundNumber);

    // 🧠 Create a new Round in MongoDB
    currentRound = new Round({
      roundNumber,
      crashPoint,
      startTime: new Date(),
      serverSeed,
      crashPointHash: crypto
        .createHash("sha256")
        .update(serverSeed + roundNumber)
        .digest("hex"),
    });
    await currentRound.save();

    // 📢 Notify clients a new round has started
    io.emit("gameStarted", {
      roundNumber,
      serverSeed,
      crashPointHash: currentRound.crashPointHash,
    });

    const startTime = Date.now();

    const multiplierInterval = setInterval(async () => {
      const elapsed = (Date.now() - startTime) / 1000;
      currentMultiplier = parseFloat((1 + elapsed * growthRate).toFixed(2));

      io.emit("multiplierUpdate", currentMultiplier);

      if (currentMultiplier >= crashPoint) {
        clearInterval(multiplierInterval);
        roundInProgress = false;

        // 🛑 Game crashed, update round in DB
        currentRound.endTime = new Date();
        currentRound.actualCrashPoint = currentMultiplier;
        await currentRound.save();

        io.emit("gameCrashed", {
          roundNumber,
          crashPoint: currentMultiplier,
        });
      }
    }, 100); // update multiplier every 100ms
  }, 10000); // start new round every 10 seconds
};
