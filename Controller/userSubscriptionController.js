const userSubscription = require('../Models/userSubscriptionModel');
const User = require('../Models/userModel');
const Product = require("../Models/productModel");
const Plan = require('../Models/planModel');



exports.createSubscription = async (req, res) => {
    try {
        const { productId, planId, quantity, startDate, endDate } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ status: 404, message: "product not found" });
        }
        const plan = await Plan.findById(planId)
        if (!plan) {
            return res.status(404).json({ status: 404, message: "Plan not found" });
        }

        const subscription = new userSubscription({
            productId,
            planId,
            userId: user._id,
            quantity,
            startDate,
            endDate
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
        const data = await userSubscription.find();
        console.log(data);
        res.status(200).json({
            subs: data,
        });
    } catch (err) {
        res.status(400).send({ mesage: err.mesage });
    }
};

exports.getSubscriptionById = async (req, res) => {
    try {
        const subscriptionId = req.params.subscriptionId;
        const subscription = await userSubscription.findById(subscriptionId);
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
        }

        if (req.body.planId) {
            const plan = await Plan.findById(req.body.planId)
            if (!plan) {
                return res.status(404).json({ status: 404, message: "Plan not found" });
            }
        }

        const updatedSubscription = await userSubscription.findByIdAndUpdate(subscriptionId, updates, { new: true });

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

        const find = await userSubscription.findByIdAndDelete(subscriptionId);
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
