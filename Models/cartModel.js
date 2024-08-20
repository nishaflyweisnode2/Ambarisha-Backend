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
    isCouponApplied: {
      type: Boolean,
      default: false
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
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    packagingCharge: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
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
