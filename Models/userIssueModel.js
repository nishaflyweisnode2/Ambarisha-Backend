const mongoose = require('mongoose');

const userOrderIssueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        }
    ],
    ticketId: {
        type: String,
    },
    recived: {
        type: Boolean,
        default: false
    },
    poroductDemage: {
        type: Boolean,
        default: false
    },
    quanityIssue: {
        type: Boolean,
        default: false
    },
    otherIssues: {
        type: Boolean,
        default: false
    },
    qualityImage: {
        type: String,
    },
    wrongItem: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserOrderIssue = mongoose.model('UserOrderIssue', userOrderIssueSchema);

module.exports = UserOrderIssue;
