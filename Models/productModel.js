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
    enum: ["Kg", "Liter", "Packet", "Pieces"],
  },
  quantity: {
    type: Number,
  },
  originalPrice: {
    type: Number,
    default: 0
},
discountPrice: {
    type: Number,
    default: 0
},
discount: {
    type: Number,
    default: 0
},
discountActive: {
    type: Boolean,
    default: false
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
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  dailyOffers: [{
    date: Date,
    discountAmount: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);
