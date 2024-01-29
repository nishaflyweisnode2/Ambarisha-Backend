const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    code: {
      type: String,
      default: "",
    },
    couponCode: {
      type: String,
    },
    couponDiscount: {
      type: String,
      default: 0,
    },
    shippingAmount: {
      type: String,
      default: 0,
    },
    subtotal: {
      type: String,
      default: 0,
    },
    taxAmount: {
      type: String,
      default: 0,
    },
    discountAmount: {
      type: String,
      default: 0,
    },
    subtotalAmount: {
      type: String,
      default: 0,
    },
    totalAmount: {
      type: String,
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

  { timestamps: true, strictPopulate: false }
);

module.exports = mongoose.model("Cart", cartSchema);
