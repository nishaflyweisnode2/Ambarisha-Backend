const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
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
