const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const Holiday = mongoose.model('Holiday', holidaySchema);

module.exports = Holiday;
