// models/WalletTransaction.js

const mongoose = require("mongoose");
const { type } = require("os");

const walletTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  transactionType: { type: String, enum: ["add", "remove"] },
  amount: Number,
  status: { type: String, enum: ['PENDING', 'FAILED', 'PAID'], default: "PENDING" },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
