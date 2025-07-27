const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Transaction = require("../models/Transaction");
const { getPrices } = require("../services/cryptoService");
const crypto = require("crypto");

// ✅ Simple test route to check prices from CoinGecko
router.get("/test-prices", async (req, res) => {
  const prices = await getPrices();
  console.log("✅ /test-prices | Prices Fetched:", prices);
  res.json(prices);
});

// ✅ Route to create a test player manually
router.post("/create-test-player", async (req, res) => {
  try {
    const existing = await Player.findOne({ username: "testuser" });
    if (existing)
      return res.json({ msg: "Player already exists", player: existing });

    const player = await Player.create({
      username: "testuser",
      wallet: {
        BTC: 1,
        ETH: 10,
      },
    });

    res.json({ msg: "Player created", player });
  } catch (err) {
    console.error("❌ /create-test-player | Error:", err);
    res.status(500).json({ msg: "Error creating player" });
  }
});

// ✅ Main /bet route
router.post("/bet", async (req, res) => {
  try {
    const { username, usdAmount, currency } = req.body;

    console.log("🟡 /bet | Incoming request body:", req.body);

    const prices = await getPrices();
    console.log("🔵 /bet | Prices from getPrices():", prices);

    const price = prices?.[currency]; // safe access
    console.log(`🟢 /bet | Selected price for '${currency}':`, price);

    if (!price || isNaN(price)) {
      console.warn("❌ /bet | Invalid or missing crypto price");
      return res.status(400).json({ msg: "Invalid or missing crypto price" });
    }

    const cryptoAmount = usdAmount / price;
    console.log("💰 /bet | Calculated cryptoAmount:", cryptoAmount);

    if (isNaN(cryptoAmount)) {
      console.warn("❌ /bet | Invalid crypto amount calculation");
      return res
        .status(400)
        .json({ msg: "Calculated crypto amount is invalid" });
    }

    const player = await Player.findOne({ username });
    if (!player) {
      console.warn("❌ /bet | Player not found:", username);
      return res.status(404).json({ msg: "Player not found" });
    }

    if (player.wallet[currency] < cryptoAmount) {
      console.warn("❌ /bet | Insufficient balance for", username);
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

    console.log("✅ /bet | Bet placed successfully for", username);

    res.json({ msg: "Bet placed", cryptoAmount, txHash });
  } catch (err) {
    console.error("🔥 /bet | Server error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
