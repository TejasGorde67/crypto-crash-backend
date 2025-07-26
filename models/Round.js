const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    roundNumber: { type: Number, required: true, unique: true },
    crashPoint: { type: Number, required: true },
    seed: { type: String, required: true },
    bets: [
      {
        playerId: String,
        cryptoAmount: Number,
        currency: String,
        usdAmount: Number,
        cashedOut: Boolean,
        cashoutMultiplier: Number,
        cashoutAmount: Number,
      },
    ],
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Round", roundSchema);
