const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  name: {
    type: String,
  },
  image: {
    type: String
  },
  status: {
    type: Boolean,
    default: false
  },
})

module.exports = mongoose.model("Apartment", ApartmentSchema);