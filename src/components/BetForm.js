// Near the top of your component, with other state variables
const [error, setError] = useState("");

const handlePlaceBet = async (e) => {
  e.preventDefault();

  console.log("Placing bet with currency:", currency, "amount:", amount);

  try {
    // First fetch the current price of the selected cryptocurrency
    const coinId = getCoinId(currency);
    console.log("Fetching price for:", coinId);

    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const priceData = await priceResponse.json();
    console.log("Price data received:", priceData);

    // Extract the price from the response
    if (!priceData[coinId] || !priceData[coinId].usd) {
      console.error("Invalid price data:", priceData);
      setError("Failed to fetch crypto price");
      return;
    }

    const cryptoPrice = priceData[coinId].usd;
    console.log("Crypto price:", cryptoPrice);

    // Now place the bet with the fetched price
    const betData = {
      username: "testuser", // Using the test user we created
      usdAmount: parseFloat(amount),
      currency: currency,
      cryptoPrice: cryptoPrice,
    };
    console.log("Sending bet data:", betData);

    const response = await fetch(
      "https://crypto-crash-backend-180q.onrender.com/api/bet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(betData),
      }
    );

    const data = await response.json();
    console.log("Response from server:", data);

    if (response.ok) {
      setError("");
      // Handle successful bet placement
      console.log("Bet placed successfully:", data);
      // You might want to trigger game state updates here
    } else {
      setError(data.error || "Failed to place bet");
    }
  } catch (err) {
    console.error("Error placing bet:", err);
    setError("Error placing bet. Please try again: " + err.message);
  }
};

// Helper function to convert currency symbol to CoinGecko ID
function getCoinId(currency) {
  const mapping = {
    BTC: "bitcoin",
    ETH: "ethereum",
    // Add more mappings as needed
  };
  return mapping[currency] || currency.toLowerCase();
}

// Replace the incorrect error display with this:
<button type="submit">Place Bet</button>;
{
  error && (
    <div className="error-message" style={{ color: "red" }}>
      {error}
    </div>
  );
}
