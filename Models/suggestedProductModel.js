const mongoose = require('mongoose');

const suggestedProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const SuggestedProduct = mongoose.model('SuggestedProduct', suggestedProductSchema);

module.exports = SuggestedProduct;
