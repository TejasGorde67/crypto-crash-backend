const axios = require("axios");

let cachedPrices = null;
let lastFetched = 0;

async function getPrices() {
  const now = Date.now();
  const cacheDuration = 60 * 1000; // Cache for 60 seconds

  if (cachedPrices && now - lastFetched < cacheDuration) {
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

    cachedPrices = {
      BTC: res.data.bitcoin?.usd,
      ETH: res.data.ethereum?.usd,
    };
    lastFetched = now;
    console.log("✅ Fetched fresh prices:", cachedPrices);
    return cachedPrices;
  } catch (err) {
    console.error("❌ Error fetching prices from CoinGecko:", err.message);
    return cachedPrices || {}; // return fallback
  }
}

module.exports = { getPrices };
