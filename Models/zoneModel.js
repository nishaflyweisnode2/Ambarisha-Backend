const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  categoryId: [{
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  }],
  productId: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  }],
  name: {
    type: String,
  },
  code: {
    type: String,
  },
  image: {
    type: String
  },
  type: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
})

module.exports = mongoose.model("Zone", ZoneSchema);