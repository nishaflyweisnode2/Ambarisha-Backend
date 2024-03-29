const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
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
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['top', 'bottom', 'middle'],
    },
    link: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },

});

module.exports = mongoose.model("Banner", bannerSchema);