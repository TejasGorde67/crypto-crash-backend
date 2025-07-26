const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { getPrices } = require("../services/cryptoService");
const crypto = require("crypto");

router.post("/cashout", async (req, res) => {
  try {
    const { username, cryptoAmount, multiplier, currency } = req.body;

    if (!username || !cryptoAmount || !multiplier || !currency) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const prices = await getPrices();
    const price = prices[currency];

    if (!price || isNaN(price)) {
      return res.status(400).json({ msg: "Invalid crypto price" });
    }

    const usdReturned = cryptoAmount * multiplier * price;

    if (isNaN(usdReturned)) {
      return res.status(400).json({ msg: "Invalid USD calculation" });
    }

    const player = await Player.findOne({ username });
    if (!player) return res.status(404).json({ msg: "Player not found" });

    player.wallet[currency] += cryptoAmount;
    await player.save();

    const txHash = crypto.randomBytes(8).toString("hex");

    await Transaction.create({
      playerId: player._id,
      usdAmount: usdReturned,
      cryptoAmount,
      currency,
      transactionType: "cashout",
      transactionHash: txHash,
      priceAtTime: price,
    });

    return res.json({ msg: "Cashout successful", usdReturned, txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
