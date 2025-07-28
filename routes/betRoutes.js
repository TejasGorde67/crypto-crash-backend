const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema({
  roundId: {
    type: String,
    required: true,
    unique: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  crashPoint: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["waiting", "running", "crashed"],
    default: "waiting",
  },
  bets: [
    {
      username: String,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      placedAt: Date,
    },
  ],
  cashouts: [
    {
      username: String,
      multiplier: Number,
      cashedOutAt: Date,
      cryptoAmountWon: Number,
    },
  ],
  seed: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Round", RoundSchema);
