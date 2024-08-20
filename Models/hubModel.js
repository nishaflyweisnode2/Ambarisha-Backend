const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
    },
    address: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
});


const City = mongoose.model('Hubs', citySchema);

module.exports = City;
