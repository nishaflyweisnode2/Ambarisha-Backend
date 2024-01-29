const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "required"],
  },
  image: {
    type: String,
  },
  isDiscount: {
    type: Boolean,
    default: false,
  },
  percentage: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Category", categorySchema);
