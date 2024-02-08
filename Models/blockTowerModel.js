const mongoose = require("mongoose");

const ApartmentSchema = new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment",
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
    },
    name: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model("TowerBlock", ApartmentSchema);