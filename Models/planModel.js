const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
