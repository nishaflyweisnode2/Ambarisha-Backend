const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
    userMembership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMembership",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subs",
    },
    userSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubs",
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
    subtotal: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    dliveryCharge: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'accepted', 'rejected', 'picked', 'checked', 'preparing', 'ready to deliver', 'rejected', 'delivered', 'emergency'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    pdfLink: {
      type: String
    },
    frequency: {
      type: String,
      enum: ["", "onetime", "daily", "weekly", "weekend", "alternate"],
      // default: "onetime",
    },
    // dayOfWeek: {
    //   type: [String],
    //   enum: [
    //     "Monday",
    //     "Tuesday",
    //     "Wednesday",
    //     "Thursday",
    //     "Friday",
    //     "Saturday",
    //     "Sunday",
    //   ],
    // },
    // specificDates: [
    //   {
    //     type: Date,
    //   },
    // ],
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
