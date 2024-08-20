const mongoose = require("mongoose");
const Cluster = require("./clusterModel");

const ApartmentSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cluster",
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