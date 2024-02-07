const mongoose = require("mongoose");

const subsSchema = mongoose.Schema({
    subId: {
        type: mongoose.Schema.ObjectId,
        ref: " subs",
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: " Product",
    },
    planId: {
        type: mongoose.Schema.ObjectId,
        ref: " Plan",
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: " User",
    },
    quantity: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isSubscription: {
        type: Boolean,
        default: false
    }
})



const subs = mongoose.model('UserSubs', subsSchema);

module.exports = subs