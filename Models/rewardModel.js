const mongoose = require("mongoose");

const rewardPointSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("RewardPoint", rewardPointSchema);
