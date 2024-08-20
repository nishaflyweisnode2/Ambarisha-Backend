const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: " Category",
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: " Product",
  },
  couponCode: {
    type: String,
    unique: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  usedInOrder: {
    type: Boolean,
    default: false,
},
});

module.exports = mongoose.model("Coupon", couponSchema);