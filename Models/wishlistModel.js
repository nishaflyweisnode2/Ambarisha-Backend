const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  products: {
    type: [mongoose.Schema.ObjectId],
    ref: "Product"
  }
});

module.exports = mongoose.model("Wishlist", wishlistSchema)