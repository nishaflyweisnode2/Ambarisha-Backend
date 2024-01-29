const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  tax: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tax", taxSchema);
