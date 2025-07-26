const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { getPrices } = require("../services/cryptoService");
const crypto = require("crypto");

router.post("/bet", async (req, res) => {
  try {
    const { username, usdAmount, currency } = req.body;
    const prices = await getPrices();
    const price = prices[currency];

    if (!price || isNaN(price)) {
      return res.status(400).json({ msg: "Invalid or missing crypto price" });
    }

    const cryptoAmount = usdAmount / price;

    if (isNaN(cryptoAmount)) {
      return res
        .status(400)
        .json({ msg: "Calculated crypto amount is invalid" });
    }

    const player = await Player.findOne({ username });
    if (!player) return res.status(404).json({ msg: "Player not found" });

    if (player.wallet[currency] < cryptoAmount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    player.wallet[currency] -= cryptoAmount;
    await player.save();

    const txHash = crypto.randomBytes(8).toString("hex");

    await Transaction.create({
      playerId: player._id,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: "bet",
      transactionHash: txHash,
      priceAtTime: price,
    });

    res.json({ msg: "Bet placed", cryptoAmount, txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
