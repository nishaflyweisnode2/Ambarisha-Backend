const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  image: {
    type: String
},
})

module.exports = mongoose.model("Apartment", ApartmentSchema);