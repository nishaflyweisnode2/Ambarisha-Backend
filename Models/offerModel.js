const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    code: {
        type: String,
        unique: true,
        trim: true,
    },
    discountPercentage: {
        type: Number,
    },
    validFrom: {
        type: Date,
    },
    validTo: {
        type: Date,
    },
});

module.exports = mongoose.model('Offer', offerSchema);