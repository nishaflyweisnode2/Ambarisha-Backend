const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    description: {
        type: String,
    },
    benefits: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    },
    promoCode: {
        type: String,
    },

}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
