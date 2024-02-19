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
        const userMemberships = await UserMembership.find();

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
        const userMemberships = await UserMembership.findOne({ userId: user._id });

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

        let userMembership = await UserMembership.findById(id);

        if (!userMembership) {
            return res.status(404).json({ error: 'User membership not found' });
        }

        userMembership.set(req.body);

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
