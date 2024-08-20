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
const ContactInformation = require('../Models/ContactusModel');
const CartMinimumPrice = require('../Models/cartMinimumPriceModel');
const AdminIssue = require('../Models/issueModel');
const PackagingCharge = require('../Models/packagingModel');
const Hub = require('../Models/hubModel');
const Cluster = require('../Models/clusterModel');
const UserSubscription = require('../Models/userSubscriptionModel');
const UserMembership = require('../Models/userMemberShipModel');







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

exports.getAllUser1 = async (req, res) => {
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

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        const userMemberships = await UserMembership.find().populate('userId membershipId');
        const subs = await UserSubscription.find().populate('productId planId subId userId');

        if (!users || users.length === 0) {
            return res.status(404).json({ status: 404, message: 'Users not found' });
        }

        const formattedUsers = users.map(user => {
            const userMembership = userMemberships.filter(membership => membership.userId._id.toString() === user._id.toString());
            const userSubscriptions = subs.filter(sub => sub.userId._id.toString() === user._id.toString());

            return {
                _id: user._id,
                user: user,
                memberSince: user.createdAt.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                }),
                memberships: userMembership,
                subscriptions: userSubscriptions
            };
        });

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
        return res.status(200).json({ status: 200, message: 'Plan updated successfully', data: plan });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: 404, message: 'Plan not found' });
        }
        return res.status(200).json({ status: 200, message: 'Plan deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
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
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: error.message,
        });
    }
});

exports.createMembership = async (req, res) => {
    try {
        const membership = await Membership.create(req.body);
        return res.status(201).json({ success: true, data: membership });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find();
        return res.status(200).json({ success: true, count: memberships.length, data: memberships });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
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
        return res.status(201).json({ success: true, data: rewardPoint });
    } catch (error) {
        console.error('Error creating reward point:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getAllRewardPoints = async (req, res) => {
    try {
        const rewardPoints = await RewardPoint.find().populate('user');
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

        const foundUser = await User.findById(user);
        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        foundUser.coin += points;

        await foundUser.save();

        const updatedRewardPoint = await RewardPoint.findByIdAndUpdate(id, { user, points: points, description }, { new: true });
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

exports.createContactInformation = async (req, res) => {
    try {
        const { phoneCall, email, whatsappChat } = req.body;
        const contactInfo = new ContactInformation({
            phoneCall,
            email,
            whatsappChat
        });
        const savedContactInfo = await contactInfo.save();
        return res.status(201).json(savedContactInfo);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.getAllContactInformation = async (req, res) => {
    try {
        const contactInfo = await ContactInformation.find();
        res.status(200).json(contactInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContactInformationById = async (req, res) => {
    try {
        const contactInfo = await ContactInformation.findById(req.params.id);
        if (!contactInfo) {
            return res.status(404).json({ message: 'Contact information not found' });
        }
        res.status(200).json(contactInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateContactInformation = async (req, res) => {
    try {
        const { phoneCall, email, whatsappChat } = req.body;
        const updatedContactInfo = await ContactInformation.findByIdAndUpdate(req.params.id, {
            phoneCall,
            email,
            whatsappChat
        }, { new: true });
        if (!updatedContactInfo) {
            return res.status(404).json({ message: 'Contact information not found' });
        }
        res.status(200).json(updatedContactInfo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteContactInformation = async (req, res) => {
    try {
        const deletedContactInfo = await ContactInformation.findByIdAndDelete(req.params.id);
        if (!deletedContactInfo) {
            return res.status(404).json({ message: 'Contact information not found' });
        }
        res.status(200).json({ message: 'Contact information deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.createCartMinimumPrice = async (req, res) => {
    try {
        const { minimumPrice, dliveryCharge } = req.body;
        const cartMinimumPrice = await CartMinimumPrice.create({ minimumPrice, dliveryCharge });
        return res.status(201).json({ status: 201, data: cartMinimumPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getCartMinimumPrice = async (req, res) => {
    try {
        const cartMinimumPrice = await CartMinimumPrice.findOne();
        if (!cartMinimumPrice) {
            return res.status(404).json({ message: 'Cart minimum price not found' });
        }
        res.status(200).json({ status: 200, data: cartMinimumPrice });
    } catch (error) {
        res.status(400).json({ status: 500, message: error.message });
    }
};

exports.updateCartMinimumPrice = async (req, res) => {
    try {
        const { minimumPrice, dliveryCharge } = req.body;
        const cartMinimumPrice = await CartMinimumPrice.findOne();
        if (!cartMinimumPrice) {
            return res.status(404).json({ message: 'Cart minimum price not found' });
        }
        cartMinimumPrice.minimumPrice = minimumPrice;
        cartMinimumPrice.dliveryCharge = dliveryCharge;
        await cartMinimumPrice.save();
        res.status(200).json({ status: 200, message: 'Cart minimum price updated successfully', cartMinimumPrice });
    } catch (error) {
        res.status(400).json({ status: 500, message: error.message });
    }
};

exports.deleteCartMinimumPrice = async (req, res) => {
    try {
        const cartMinimumPrice = await CartMinimumPrice.findOne();
        if (!cartMinimumPrice) {
            return res.status(404).json({ message: 'Cart minimum price not found' });
        }
        await cartMinimumPrice.deleteOne();
        res.status(200).json({ status: 200, message: 'Cart minimum price deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 500, message: error.message });
    }
};

exports.createAdminIssue = async (req, res) => {
    try {
        const { title } = req.body;
        const newIssue = new AdminIssue({ title });
        await newIssue.save();
        return res.status(201).json({ message: 'Admin issue created successfully', issue: newIssue });
    } catch (error) {
        console.error('Error creating admin issue:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllAdminIssues = async (req, res) => {
    try {
        const issues = await AdminIssue.find();
        res.status(200).json({ issues });
    } catch (error) {
        console.error('Error fetching admin issues:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAdminIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await AdminIssue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Admin issue not found' });
        }
        res.status(200).json({ issue });
    } catch (error) {
        console.error('Error fetching admin issue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateAdminIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const updatedIssue = await AdminIssue.findByIdAndUpdate(id, { title }, { new: true });
        if (!updatedIssue) {
            return res.status(404).json({ message: 'Admin issue not found' });
        }
        res.status(200).json({ message: 'Admin issue updated successfully', issue: updatedIssue });
    } catch (error) {
        console.error('Error updating admin issue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteAdminIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIssue = await AdminIssue.findByIdAndDelete(id);
        if (!deletedIssue) {
            return res.status(404).json({ message: 'Admin issue not found' });
        }
        res.status(200).json({ message: 'Admin issue deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin issue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createPackagingCharge = async (req, res) => {
    try {
        const { chargeAmount, oldAmount, status } = req.body;
        const newPackagingCharge = new PackagingCharge({ chargeAmount, oldAmount, status });
        const savedCharge = await newPackagingCharge.save();
        return res.status(201).json({ status: 201, message: 'Packaging charge created successfully', data: savedCharge });
    } catch (error) {
        console.error('Error creating packaging charge:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.getAllPackagingCharges = async (req, res) => {
    try {
        const charges = await PackagingCharge.find();
        return res.status(200).json({ status: 200, data: charges });
    } catch (error) {
        console.error('Error getting packaging charges:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.getPackagingChargeById = async (req, res) => {
    try {
        const chargeId = req.params.id;
        const charge = await PackagingCharge.findById(chargeId);
        if (!charge) {
            return res.status(404).json({ status: 404, message: 'Packaging charge not found' });
        }
        return res.status(200).json({ status: 200, data: charge });
    } catch (error) {
        console.error('Error getting packaging charge by ID:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.updatePackagingChargeById = async (req, res) => {
    try {
        const chargeId = req.params.id;
        const { chargeAmount, oldAmount, status } = req.body;
        const updatedCharge = await PackagingCharge.findByIdAndUpdate(chargeId, { chargeAmount, oldAmount, status }, { new: true });
        if (!updatedCharge) {
            return res.status(404).json({ status: 404, message: 'Packaging charge not found' });
        }
        return res.status(200).json({ status: 200, message: 'Packaging charge updated successfully', data: updatedCharge });
    } catch (error) {
        console.error('Error updating packaging charge:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.deletePackagingChargeById = async (req, res) => {
    try {
        const chargeId = req.params.id;
        const deletedCharge = await PackagingCharge.findByIdAndDelete(chargeId);
        if (!deletedCharge) {
            return res.status(404).json({ status: 404, message: 'Packaging charge not found' });
        }
        return res.status(200).json({ status: 200, message: 'Packaging charge deleted successfully', data: deletedCharge });
    } catch (error) {
        console.error('Error deleting packaging charge:', error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};

exports.createHub = async (req, res) => {
    try {
        const { name, city, address, status } = req.body;
        const newHub = new Hub({ name, city, address, status });

        await newHub.save();

        return res.status(201).json({ status: 201, message: 'Hub created successfully', data: newHub });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to create hub', error: error.message });
    }
};

exports.getAllHubs = async (req, res) => {
    try {
        const hubs = await Hub.find().populate('city');

        return res.status(200).json({ status: 200, message: 'Hubs retrieved successfully', data: hubs });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to retrieve hubs', error: error.message });
    }
};

exports.getHubById = async (req, res) => {
    try {
        const hub = await Hub.findById(req.params.id).populate('city');

        if (!hub) {
            return res.status(404).json({ status: 404, message: 'Hub not found' });
        }

        return res.status(200).json({ status: 200, message: 'Hub retrieved successfully', data: hub });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to retrieve hub', error: error.message });
    }
};

exports.updateHub = async (req, res) => {
    try {
        const updatedHub = await Hub.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedHub) {
            return res.status(404).json({ status: 404, message: 'Hub not found' });
        }

        return res.status(200).json({ status: 200, message: 'Hub updated successfully', data: updatedHub });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to update hub', error: error.message });
    }
};

exports.deleteHub = async (req, res) => {
    try {
        const deletedHub = await Hub.findByIdAndDelete(req.params.id);

        if (!deletedHub) {
            return res.status(404).json({ status: 404, message: 'Hub not found' });
        }

        return res.status(200).json({ status: 200, message: 'Hub deleted successfully' });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to delete hub', error: error.message });
    }
};

exports.createCluster = async (req, res) => {
    try {
        const { clusterName, clusterNumber, hubName, dwcCluster, clusterType, loadingTimeStart, loadingTimeOut, recceDistance } = req.body;
        const newCluster = new Cluster({
            clusterName,
            clusterNumber,
            hubName,
            dwcCluster,
            clusterType,
            loadingTimeStart,
            loadingTimeOut,
            recceDistance
        });

        await newCluster.save();

        return res.status(201).json({ status: 201, message: 'Cluster created successfully', data: newCluster });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to create cluster', error: error.message });
    }
};

exports.getAllClusters = async (req, res) => {
    try {
        const clusters = await Cluster.find().populate('hubName');
        return res.status(200).json({ status: 200, message: 'Clusters retrieved successfully', data: clusters });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to retrieve clusters', error: error.message });
    }
};

exports.getClusterById = async (req, res) => {
    try {
        const cluster = await Cluster.findById(req.params.id).populate('hubName');
        if (!cluster) {
            return res.status(404).json({ status: 404, message: 'Cluster not found' });
        }
        return res.status(200).json({ status: 200, message: 'Cluster retrieved successfully', data: cluster });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to retrieve cluster', error: error.message });
    }
};

exports.updateClusterById = async (req, res) => {
    try {
        const { clusterName, clusterNumber, hubName, dwcCluster, clusterType, loadingTimeStart, loadingTimeOut, recceDistance } = req.body;
        const updatedCluster = await Cluster.findByIdAndUpdate(
            req.params.id,
            { clusterName, clusterNumber, hubName, dwcCluster, clusterType, loadingTimeStart, loadingTimeOut, recceDistance },
            { new: true }
        ).populate('hubName');

        if (!updatedCluster) {
            return res.status(404).json({ status: 404, message: 'Cluster not found' });
        }

        return res.status(200).json({ status: 200, message: 'Cluster updated successfully', data: updatedCluster });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to update cluster', error: error.message });
    }
};

exports.deleteClusterById = async (req, res) => {
    try {
        const deletedCluster = await Cluster.findByIdAndDelete(req.params.id);

        if (!deletedCluster) {
            return res.status(404).json({ status: 404, message: 'Cluster not found' });
        }

        return res.status(200).json({ status: 200, message: 'Cluster deleted successfully' });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Failed to delete cluster', error: error.message });
    }
};

exports.updateUserVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.query;
        console.log('req.query:', req.query);
        console.log('Updating user:', id);
        console.log('New isVerified value:', isVerified);

        const isVerifiedBool = isVerified === 'true';

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        user.isVerified = isVerifiedBool;
        const updatedUser = await user.save();

        return res.status(200).json({
            status: 200,
            message: 'User verification status updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};



