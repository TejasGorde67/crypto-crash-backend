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

let cache = {};

const getPrices = async () => {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );
    const data = res.data;

    cache = {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
    };

    return cache;
  } catch (error) {
    console.error("Price fetch failed. Using last cache.");
    return cache;
  }
};

module.exports = { getPrices };
