const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "liter", "packet", "pieces"],
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  isDiscount: {
    type: Boolean,
    default: false,
  },

  discountedPrice: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  description: {
    type: String,
  },

  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subcategory: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Subcategory",
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Stock"],
    default: 1,
  },
  details: {
    type: [String],
  },
  type: {
    type: String,
    enum: ["popular", "demand", "packet", "pieces", "dailyessential", "everydayessential", "weekendsale"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  //   sellerId: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "Seller",

  //   },
  type: {
    type: String,
  },
  brand: {
    type: String,
  },
  dailyOffers: [{
    date: Date,
    discountAmount: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   createdByRole: {
  //     type: String,
  //   },
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
