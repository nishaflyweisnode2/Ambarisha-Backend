const UserMembership = require('../Models/userMemberShipModel');
const Membership = require('../Models/memberShipModel');
const User = require("../Models/userModel");



exports.createUserMembership = async (req, res) => {
    try {
        const { membershipId, paymentMethod, promoCode } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }

        await UserMembership.updateMany(
            { userId: user._id, endDate: { $lt: new Date() } },
            { $set: { isActive: false } }
        );

        const existingMembership = await UserMembership.findOne({
            userId: user._id,
            endDate: { $gte: new Date() }
        });

        if (existingMembership) {
            return res.status(400).json({ status: 400, message: 'User already has an active membership' });
        }

        const registrationDate = user.createdAt;
        const currentDate = new Date();
        const daysSinceRegistration = Math.floor((currentDate - registrationDate) / (1000 * 60 * 60 * 24));
        console.log("daysSinceRegistration", daysSinceRegistration);

        if (promoCode && daysSinceRegistration > 48) {
            return res.status(400).json({ status: 400, message: 'Promo code expired' });
        }

        const usedPromoCodes = await UserMembership.find({
            userId: user._id,
            promoCode: promoCode
        });

        if (usedPromoCodes.length > 0) {
            return res.status(400).json({ status: 400, message: 'Promo code already used' });
        }

        const membership = await Membership.findById(membershipId);
        if (!membership) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }

        let pricePaid = membership.price;

        if (promoCode && membership.promoCode !== promoCode) {
            return res.status(400).json({ status: 400, message: 'Invalid promo code' });
        }

        if (paymentMethod === 'Promo') {
            pricePaid = 0;
        }

        let walletAmount = user.wallet;
        console.log("walletAmount", walletAmount);
        if (walletAmount < pricePaid) {
            return res.status(400).json({ status: 400, message: "Insufficient funds in your wallet" });
        }

        const startDate = new Date();
        const durationInDays = membership.duration;
        const endDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);


        const userMembership = new UserMembership({
            userId: user._id,
            membershipId,
            startDate,
            endDate,
            paymentMethod,
            promoCode,
            pricePaid,
        });

        await userMembership.save();

        res.status(201).json({ message: 'User membership created successfully', data: userMembership });
    } catch (error) {
        console.error('Error creating user membership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUserMemberships = async (req, res) => {
    try {
        const userMemberships = await UserMembership.find().populate('userId membershipId');

        res.status(200).json({ data: userMemberships });
    } catch (error) {
        console.error('Error fetching user memberships:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUserMembershipsByToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }
        console.log(req.user._id);
        const userMemberships = await UserMembership.findOne({ userId: user._id, isActive: true }).populate('userId membershipId');

        res.status(200).json({ status: 200, data: userMemberships });
    } catch (error) {
        console.error('Error fetching user memberships:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserMembershipById = async (req, res) => {
    try {
        const { id } = req.params;

        const userMembership = await UserMembership.findById(id);

        if (!userMembership) {
            return res.status(404).json({ error: 'User membership not found' });
        }

        res.status(200).json({ data: userMembership });
    } catch (error) {
        console.error('Error fetching user membership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUserMembershipById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }

        let userMembership = await UserMembership.findById(id);

        if (!userMembership) {
            return res.status(404).json({ error: 'User membership not found' });
        }

        userMembership.set(req.body);

        if(req.body.status === "Completed"){
        let walletAmount = user.wallet;
        console.log("walletAmount", walletAmount);
        if (walletAmount < userMembership.pricePaid) {
            return res.status(400).json({ status: 400, message: "Insufficient funds in your wallet" });
        }
        let newWalletAmount = walletAmount - userMembership.pricePaid;
        user.wallet = newWalletAmount;
        console.log("newWalletAmount", newWalletAmount);
        await user.save();
    }

        userMembership = await userMembership.save();

        res.status(200).json({ message: 'User membership updated successfully', data: userMembership });
    } catch (error) {
        console.error('Error updating user membership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUserMembershipById = async (req, res) => {
    try {
        const { id } = req.params;

        await UserMembership.findByIdAndDelete(id);

        res.status(200).json({ message: 'User membership deleted successfully' });
    } catch (error) {
        console.error('Error deleting user membership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.applyWalletToUserMembership = async (req, res) => {
    try {
        const { userMembershipId } = req.body;
        const userId = req.user.id;
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found', data: null });
        }

        const membership = await UserMembership.findById(userMembershipId);
        if (!membership) {
            return res.status(404).json({ message: 'Membership not found' });
        }

        if (membership.paymentMethod === 'Price') {
            if (membership.isWalletUsed) {
                return res.status(400).json({ status: 400, message: 'Wallet has already been applied to this User Membership', data: null });
            }

            if (user.wallet <= 0) {
                return res.status(400).json({ status: 400, message: 'Insufficient wallet balance', data: null });
            }

            if (user.wallet < membership.pricePaid) {
                return res.status(400).json({ status: 400, message: 'Insufficient wallet balance', data: null });
            }

            const walletAmountToUse = membership.pricePaid;
            user.wallet -= walletAmountToUse;
            await user.save();

            membership.walletAmount = walletAmountToUse;
            membership.isWalletUsed = true;

            await membership.save();
            return res.status(200).json({ status: 200, message: 'Wallet applied successfully', data: membership });
        } else {
            return res.status(400).json({ status: 400, message: 'Wallet not applied you use promocode' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};