const mongoose = require('mongoose');

const userMembershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    membershipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    paymentMethod: {
        type: String,
        enum: ['Promo', 'Price'],
    },
    promoCode: {
        type: String,
    },
    pricePaid: {
        type: Number,
    },
    walletAmount: {
        type: Number,
    },
    isWalletUsed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },

}, { timestamps: true });

const UserMembership = mongoose.model('UserMembership', userMembershipSchema);

module.exports = UserMembership;
