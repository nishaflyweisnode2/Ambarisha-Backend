const User = require('../Models/userModel');
const authConfig = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
// const Notification = require('../models/notificationModel');
const bcrypt = require("bcryptjs");
const Offer = require('../Models/offerModel');
const Product = require('../Models/productModel');
const Category = require('../Models/categoryModel');
const Subcategory = require('../Models/subCategoryModel');
const Plan = require('../Models/planModel');
const Subs = require("../Models/subsModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Membership = require('../Models/memberShipModel');
const RewardPoint = require('../Models/rewardModel');






exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], userType: "ADMIN" });
        if (!user) {
            req.body.password = bcrypt.hashSync(req.body.password, 8);
            req.body.userType = "ADMIN";
            req.body.accountVerification = true;
            const userCreate = await User.create(req.body);
            return res.status(200).send({ message: "registered successfully ", data: userCreate, });
        } else {
            return res.status(409).send({ message: "Already Exist", data: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email, userType: "ADMIN" });
        if (!user) {
            return res
                .status(404)
                .send({ message: "user not found ! not registered" });
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send({ message: "Wrong password" });
        }
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        let obj = {
            name: user.name,
            mobileNumber: user.mobileNumber,
            email: user.email,
            role: user.role,
        }
        return res.status(201).send({ data: obj, accessToken: accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" + error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobileNumber = mobileNumber || user.mobileNumber;
        if (req.body.password) {
            user.password = bcrypt.hashSync(password, 8) || user.password;
        }
        const updated = await user.save();
        return res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find()/*.populate('city');*/
        if (!users || users.length === 0) {
            return res.status(404).json({ status: 404, message: 'Users not found' });
        }

        const formattedUsers = users.map(user => ({
            _id: user._id,
            user: user,
            memberSince: user.createdAt.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }),
        }));

        return res.status(200).json({
            status: 200,
            data: formattedUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)/*.populate('city');*/
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const memberSince = user.createdAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });

        return res.status(200).json({
            status: 200, data: {
                user,
                memberSince,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({ status: 200, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.createOffer = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const { category, subCategory, product, title, description, code, discountPercentage, validFrom, validTo } = req.body;

        const checkCategory = await Category.findById(category);
        if (!checkCategory) {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }

        const checkSubCategory = await Subcategory.findById(subCategory);
        if (!checkSubCategory) {
            return res.status(404).json({ status: 404, message: 'Sub Category not found' });
        }

        const checkProduct = await Product.findById(product);
        if (!checkProduct) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        const checkOffer = await Offer.findOne({ title });

        if (checkOffer) {
            return res.status(404).json({ status: 404, message: 'Title exist with this name' });
        }

        const offer = new Offer({
            category,
            subCategory,
            product,
            title,
            image: req.file.path,
            description,
            code,
            discountPercentage,
            validFrom,
            validTo,
        });

        await offer.save();

        return res.status(201).json({ status: 201, message: 'Offer created successfully', data: offer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error creating offer', error: error.message });
    }
};

exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        return res.status(200).json({ status: 200, data: offers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching offers', error: error.message });
    }
};

exports.getOfferById = async (req, res) => {
    try {
        const offerId = req.params.offerId;
        const offer = await Offer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ status: 404, message: 'Offer not found' });
        }

        return res.status(200).json({ status: 200, data: offer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching offer', error: error.message });
    }
};

exports.updateOffer = async (req, res) => {
    try {
        const offerId = req.params.offerId;
        const updateFields = {};
        if (req.body.category) updateFields.category = req.body.category;
        if (req.body.subCategory) updateFields.subCategory = req.body.subCategory;
        if (req.body.product) updateFields.product = req.body.product;
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.code) updateFields.code = req.body.code;
        if (req.body.discountPercentage) updateFields.discountPercentage = req.body.discountPercentage;
        if (req.body.validFrom) updateFields.validFrom = req.body.validFrom;
        if (req.body.validTo) updateFields.validTo = req.body.validTo;

        if (req.body.category) {
            const checkCategory = await Category.findById(req.body.category);
            if (!checkCategory) {
                return res.status(404).json({ status: 404, message: 'Category not found' });
            }
        }

        if (req.body.subCategory) {
            const checkSubCategory = await Subcategory.findById(req.body.subCategory);
            if (!checkSubCategory) {
                return res.status(404).json({ status: 404, message: 'Sub Category not found' });
            }
        }

        if (req.body.product) {
            const checkProduct = await Product.findById(req.body.product);

            if (!checkProduct) {
                return res.status(404).json({ status: 404, message: 'Product not found' });
            }
        }

        if (req.body.title) {
            const checkOffer = await Offer.findOne({ title: req.body.title });

            if (checkOffer) {
                return res.status(404).json({ status: 404, message: 'Title exist with this name' });
            }
        }

        if (req.file) {
            updateFields.image = req.file.path;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ status: 400, message: "No valid fields to update" });
        }

        const offer = await Offer.findByIdAndUpdate(offerId, updateFields, { new: true });

        if (!offer) {
            return res.status(404).json({ status: 404, message: 'Offer not found' });
        }

        return res.status(200).json({ status: 200, message: 'Offer updated successfully', data: offer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error updating offer', error: error.message });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const offerId = req.params.offerId;
        const offer = await Offer.findByIdAndRemove(offerId);

        if (!offer) {
            return res.status(404).json({ status: 404, message: 'Offer not found' });
        }

        return res.status(200).json({ status: 200, message: 'Offer deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error deleting offer', error: error.message });
    }
};

exports.createPlan = async (req, res) => {
    try {
        const { name, status } = req.body;
        const plan = await Plan.create({ name, status });
        return res.status(201).json({ status: 201, message: 'Plan created successfully', data: plan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        return res.status(200).json({ status: 200, data: plans });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: 404, message: 'Plan not found' });
        }
        return res.status(200).json({ status: 200, data: plan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { name, status } = req.body;
        const plan = await Plan.findByIdAndUpdate(req.params.id, { name, status }, { new: true });
        if (!plan) {
            return res.status(404).json({ status: 404, message: 'Plan not found' });
        }
        res.status(200).json({ status: 200, message: 'Plan updated successfully', data: plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: 404, message: 'Plan not found' });
        }
        res.status(200).json({ status: 200, message: 'Plan deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.updateSubscription = catchAsyncErrors(async (req, res, next) => {
    try {
        const { subscriptionId } = req.params;
        const { weight, status } = req.body;

        const subscription = await Subs.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ status: 404, message: 'Subscription not found' });
        }

        if (weight) {
            subscription.weight = weight;
        }
        if (status !== undefined) {
            subscription.status = status;
        }

        const updatedSubscription = await subscription.save();

        return res.status(200).json({
            status: 200,
            message: 'Subscription updated successfully',
            data: updatedSubscription,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});

exports.createMembership = async (req, res) => {
    try {
        const membership = await Membership.create(req.body);
        res.status(201).json({ success: true, data: membership });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.status(200).json({ success: true, count: memberships.length, data: memberships });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMembershipById = async (req, res) => {
    try {
        const membership = await Membership.findById(req.params.id);
        if (!membership) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }
        res.status(200).json({ success: true, data: membership });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateMembership = async (req, res) => {
    try {
        const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!membership) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }
        res.status(200).json({ success: true, data: membership });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteMembership = async (req, res) => {
    try {
        const membership = await Membership.findByIdAndDelete(req.params.id);
        if (!membership) {
            return res.status(404).json({ success: false, message: 'Membership not found' });
        }
        res.status(200).json({ success: true, message: 'Membership deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createRewardPoint = async (req, res) => {
    try {
        const { user, points, description } = req.body;
        const rewardPoint = new RewardPoint({ user, points, description });
        await rewardPoint.save();
        res.status(201).json({ success: true, data: rewardPoint });
    } catch (error) {
        console.error('Error creating reward point:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getAllRewardPoints = async (req, res) => {
    try {
        const rewardPoints = await RewardPoint.find();
        res.status(200).json({ success: true, data: rewardPoints });
    } catch (error) {
        console.error('Error fetching reward points:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getAllRewardPointsByUserToken = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const rewardPoints = await RewardPoint.find({ user: user._id });
        res.status(200).json({ success: true, data: rewardPoints });
    } catch (error) {
        console.error('Error fetching reward points:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getRewardPointById = async (req, res) => {
    try {
        const { id } = req.params;
        const rewardPoint = await RewardPoint.findById(id);
        if (!rewardPoint) {
            return res.status(404).json({ success: false, message: 'Reward point not found' });
        }
        res.status(200).json({ success: true, data: rewardPoint });
    } catch (error) {
        console.error('Error fetching reward point by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.updateRewardPoint = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, points, description } = req.body;
        const updatedRewardPoint = await RewardPoint.findByIdAndUpdate(id, { user, points, description }, { new: true });
        if (!updatedRewardPoint) {
            return res.status(404).json({ success: false, message: 'Reward point not found' });
        }
        res.status(200).json({ success: true, data: updatedRewardPoint });
    } catch (error) {
        console.error('Error updating reward point:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.deleteRewardPoint = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRewardPoint = await RewardPoint.findByIdAndDelete(id);
        if (!deletedRewardPoint) {
            return res.status(404).json({ success: false, message: 'Reward point not found' });
        }
        res.status(200).json({ success: true, message: 'Reward point deleted successfully' });
    } catch (error) {
        console.error('Error deleting reward point:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
