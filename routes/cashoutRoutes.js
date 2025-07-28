const express = require("express");
const router = express.Router();
const Round = require("../../models/Round");

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;

    const multiplier = global.currentMultiplier;
    const roundId = global.currentRoundId;

    if (!multiplier || !roundId) {
      return res.status(400).json({ error: "No round in progress." });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ error: "Round not found" });
    }

    const bet = round.bets.find((b) => b.username === username);
    if (!bet) {
      return res.status(404).json({ error: "Bet not found for user" });
    }

    const wonAmount = parseFloat((bet.cryptoAmount * multiplier).toFixed(8));

    round.cashouts.push({
      username,
      multiplier,
      cashedOutAt: new Date(),
      cryptoAmountWon: wonAmount,
    });

    await round.save();

    return res.status(200).json({
      message: "Cashout successful",
      username,
      multiplier,
      cryptoAmountWon: wonAmount,
    });
  } catch (error) {
    console.error("Cashout error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
