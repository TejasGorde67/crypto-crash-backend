const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundId: String,
  crashPoint: Number,
  bets: [
    {
      playerId: String,
      username: String,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      cashedOut: Boolean,
      cashoutMultiplier: Number,
    },
  ],
  startTime: Date,
  endTime: Date,
});

module.exports = mongoose.models.Round || mongoose.model("Round", roundSchema);
