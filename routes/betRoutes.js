const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

router.post("/", async (req, res) => {
  try {
    const { username, usdAmount, cryptoAmount, currency } = req.body;

    // Get the latest round that's running or waiting
    const currentRound = await Round.findOne({
      status: { $in: ["waiting", "running"] },
    }).sort({ startTime: -1 });

    if (!currentRound) {
      return res.status(400).json({ error: "No active round found." });
    }

    // Prevent duplicate bet by same user
    const existingBet = currentRound.bets.find(
      (bet) => bet.username === username
    );
    if (existingBet) {
      return res
        .status(400)
        .json({ error: "You already placed a bet in this round." });
    }

    // Add bet to current round
    currentRound.bets.push({
      username,
      usdAmount,
      cryptoAmount,
      currency,
      placedAt: new Date(),
    });

    await currentRound.save();

    res
      .status(200)
      .json({
        message: "Bet placed successfully",
        roundId: currentRound.roundId,
      });
  } catch (err) {
    console.error("Bet Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
