const UserSubscription = require('../Models/userSubscriptionModel');
const User = require('../Models/userModel');
const Product = require("../Models/productModel");
const Plan = require('../Models/planModel');
const Subs = require("../Models/subsModel");



exports.createSubscription = async (req, res) => {
    try {
        const { subId, productId, planId, quantity, startDate, endDate, isSubscription } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }

        await UserSubscription.updateMany(
            { userId: user._id, endDate: { $lt: new Date() } },
            { $set: { isSubscription: false } }
        );

        const existingSubscription = await UserSubscription.findOne({
            userId: user._id,
            subId: subId,
            productId: productId,
            planId: planId,
            startDate: startDate,
            endDate: endDate,
        });

        if (existingSubscription) {
            return res.status(400).json({ status: 400, message: 'Subscription already exists for this user', data: existingSubscription });
        }

        const checkSubscription = await Subs.findById(subId);
        if (!checkSubscription) {
            return res.status(404).json({ status: 404, message: 'Subscription not found' });
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ status: 404, message: "product not found" });
        }

        const price = product.discountActive ? product.discountPrice : product.originalPrice;

        let walletAmount = user.wallet;
        console.log("walletAmount", walletAmount);
        console.log("price", price);
        console.log("price.quantity", price * quantity);

        if (walletAmount < price * quantity) {
            return res.status(400).json({ status: 400, message: "Insufficient funds in your wallet" });
        }

        const plan = await Plan.findById(planId)
        if (!plan) {
            return res.status(404).json({ status: 404, message: "Plan not found" });
        }

        const subscription = new UserSubscription({
            subId,
            productId,
            planId,
            userId: user._id,
            quantity,
            startDate,
            endDate,
            isSubscription
        });

        const newSubscription = await subscription.save();

        res.status(201).json({
            status: 'success',
            message: 'Subscription created successfully',
            data: newSubscription
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: error.message
        });
    }
};

exports.getSubscription = async (req, res) => {
    try {
        const subs = await UserSubscription.find().populate('productId planId subId userId');
        return res.status(200).json({
            status: 200,
            data: subs,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ mesage: err.mesage });
    }
};

exports.getUserSubscription = async (req, res) => {
    try {
        console.log(req.user._id);
        const data = await UserSubscription.find({ userId: req.user._id }).populate('productId planId subId userId');
        res.status(200).json({
            status: 200,
            subs: data,
        });
    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
};

exports.getSubscriptionById = async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        const subscription = await UserSubscription.findById(subscriptionId).populate('productId planId subId userId');
        if (!subscription) {
            return res.status(404).json({ status: 404, message: 'Subscription not found' });
        }
        res.status(200).json({
            status: 200,
            data: subscription,
        });
    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const updates = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }

        if (req.body.ProductId) {
            const product = await Product.findById(req.body.ProductId)
            if (!product) {
                return res.status(404).json({ status: 404, message: "product not found" });
            }
            
            const price = product.discountActive ? product.discountPrice : product.originalPrice;

            let walletAmount = user.wallet;
            console.log("walletAmount", walletAmount);
            console.log("price", price);
            console.log("price.quantity", price * quantity);

            if (walletAmount < price * quantity) {
                return res.status(400).json({ status: 400, message: "Insufficient funds in your wallet" });
            }
        }

        if (req.body.planId) {
            const plan = await Plan.findById(req.body.planId)
            if (!plan) {
                return res.status(404).json({ status: 404, message: "Plan not found" });
            }
        }

        const updatedSubscription = await UserSubscription.findByIdAndUpdate(subscriptionId, updates, { new: true });

        if (!updatedSubscription) {
            return res.status(404).json({
                status: 'error',
                message: 'Subscription not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Subscription updated successfully',
            data: updatedSubscription
        });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: error.message
        });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const find = await UserSubscription.findByIdAndDelete(subscriptionId);
        if (!find) {
            return res.status(404).json({
                status: 404,
                message: 'Subscription not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Subscription deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: error.message
        });
    }
};
