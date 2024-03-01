const mongoose = require('mongoose');

const adminIssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AdminIssue = mongoose.model('Issue', adminIssueSchema);

module.exports = AdminIssue;
