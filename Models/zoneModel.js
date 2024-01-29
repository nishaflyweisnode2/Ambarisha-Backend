const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  apartmentId: {
    type: mongoose.Schema.ObjectId,
    ref: " Apartment",
  },
  name: {
    type: String,
  },
  image: {
    type: String
},
})

module.exports = mongoose.model("Zone", ZoneSchema);