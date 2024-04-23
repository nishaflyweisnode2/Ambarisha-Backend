const mongoose = require('mongoose');

const packagingChargeSchema = new mongoose.Schema({
    chargeAmount: {
        type: Number,
        min: 0
    },
    oldAmount: {
        type: Number,
        min: 0
    },
    status: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("PackagingCharge", packagingChargeSchema);
