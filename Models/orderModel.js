const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    // Add other fields for order details (e.g., address, status, etc.)
    totalAmount: {
      type: String,
    },

    status: {
      type: String,
      enum: ['pending','confirmed', 'accepted','rejected','picked','checked','preparing','ready to deliver' ,'rejected','delivered'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
 
    frequency: {
      type: String,
      enum: ["","onetime","daily", "weekly", "weekend", "alternate"],
      default: "onetime",
    },
    dayOfWeek: {
      type:  [String], 
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    specificDates: [
      {
        type: Date,
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
