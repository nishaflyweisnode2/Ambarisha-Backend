const mongoose = require('mongoose');

const cartMinimumPriceSchema = new mongoose.Schema({
    minimumPrice: {
        type: Number,
        required: true
    },
    dliveryCharge: {
        type: Number,
        required: true
    }
});

const CartMinimumPrice = mongoose.model('CartMinimumPrice', cartMinimumPriceSchema);

module.exports = CartMinimumPrice;
