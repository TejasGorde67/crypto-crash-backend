const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  roundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Round",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  multiplier: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["bet", "cashout"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
