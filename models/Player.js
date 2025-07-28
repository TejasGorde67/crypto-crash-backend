const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: String,
  balance: Number,
  currentBet: {
    amount: Number,
    currency: String,
    multiplier: Number,
    hasCashedOut: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports =
  mongoose.models.Player || mongoose.model("Player", playerSchema);
