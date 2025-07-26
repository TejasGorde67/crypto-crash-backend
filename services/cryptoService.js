// const axios = require("axios");

// let cachedPrices = {};
// let lastFetchTime = 0;

// const getPrices = async () => {
//   const now = Date.now();
//   if (now - lastFetchTime < 10000 && cachedPrices.BTC && cachedPrices.ETH) {
//     return cachedPrices;
//   }

//   try {
//     const res = await axios.get(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
//     );
//     cachedPrices = {
//       BTC: res.data.bitcoin.usd,
//       ETH: res.data.ethereum.usd,
//     };
//     lastFetchTime = now;
//     return cachedPrices;
//   } catch (err) {
//     console.error("Price fetch failed. Using last cache.");
//     return cachedPrices;
//   }
// };

// module.exports = { getPrices };

// cryptoService.js
const axios = require("axios");

async function getPrices() {
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

    console.log("✅ CoinGecko API response:", res.data); // <--- add this
    return {
      BTC: res.data.bitcoin?.usd,
      ETH: res.data.ethereum?.usd,
    };
  } catch (err) {
    console.error("❌ Error fetching prices from CoinGecko:", err.message); // <--- and this
    return {};
  }
}

module.exports = { getPrices };
