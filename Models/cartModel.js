const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
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
    uerrSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubs",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
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
      type: Number,
      default: 0,
    },
    shippingAmount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxAmount: {
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
  },

  { timestamps: true, strictPopulate: false }
);

module.exports = mongoose.model("Cart", cartSchema);
