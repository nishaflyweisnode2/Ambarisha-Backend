const mongoose = require("mongoose");

const subsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: " Product",
    },
    planId: {
        type: mongoose.Schema.ObjectId,
        ref: " Plan",
    },
    weight: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    }
})



const subs = mongoose.model('subs', subsSchema);

module.exports = subs