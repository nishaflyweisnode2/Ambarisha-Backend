const mongoose = require('mongoose');

const recycleBinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bag: {
        type: Boolean,
        default: false
    },
    voucherAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },

}, { timestamps: true });

const RecycleBin = mongoose.model('RecycleBin', recycleBinSchema);

module.exports = RecycleBin;
