const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  shipping: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("shipping", shippingSchema);
