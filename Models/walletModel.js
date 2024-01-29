// models/WalletTransaction.js

const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  transactionType: { type: String, enum: ["add", "remove"] },
  amount: Number,
  
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
