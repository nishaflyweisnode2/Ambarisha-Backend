const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Banner Required"],
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['top','bottom', 'middle'], // Add your allowed types here
      },
    
});

module.exports = mongoose.model("Banner", bannerSchema);