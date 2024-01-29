const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Coupon", couponSchema);