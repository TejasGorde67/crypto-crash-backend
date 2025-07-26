const axios = require("axios");

let cachedPrices = null;
let lastFetched = 0;

async function getPrices() {
  const now = Date.now();
  const tenSeconds = 10 * 1000;

  if (cachedPrices && now - lastFetched < tenSeconds) {
    return cachedPrices;
  }

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        headers: {
          "User-Agent":
            "CryptoCrashGame/1.0 (https://github.com/TejasGorde67/crypto-crash-backend)",
        },
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
    return cachedPrices || {}; // fallback to last known prices or empty
  }
}

module.exports = { getPrices };
