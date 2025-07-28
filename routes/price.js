const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const currency = req.query.currency || "BTC";

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currency.toLowerCase()}&vs_currencies=usd`
    );

    const price = response.data[currency.toLowerCase()].usd;
    res.json({ price });
  } catch (err) {
    console.error("Error fetching crypto price:", err);
    res.status(500).json({ error: "Failed to fetch crypto price" });
  }
});

module.exports = router;
