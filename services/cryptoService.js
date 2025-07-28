const axios = require("axios");

let cachedPrices = null;
let lastFetched = 0;

async function getPrices() {
  const now = Date.now();
  const cacheDuration = 60 * 1000; // 60 seconds

  if (cachedPrices && now - lastFetched < cacheDuration) {
    console.log("🟢 Returning cached prices:", cachedPrices);
    return cachedPrices;
  }

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,ethereum",
          vs_currencies: "usd",
        },
      }
    );

    const BTC = res.data?.bitcoin?.usd;
    const ETH = res.data?.ethereum?.usd;

    if (!BTC || !ETH) {
      throw new Error("❌ Missing BTC or ETH in API response");
    }

    cachedPrices = { BTC, ETH };
    lastFetched = now;

    console.log("✅ Fetched fresh prices:", cachedPrices);
    return cachedPrices;
  } catch (err) {
    console.error("🔥 Error fetching prices:", err.message);
    return cachedPrices || { BTC: 30000, ETH: 2000 }; // fallback hardcoded prices
  }
}

module.exports = { getPrices };
