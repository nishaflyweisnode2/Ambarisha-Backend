const Coupon = require('../Models/couponModel')
const Category = require("../Models/categoryModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");


exports.AddCoupon = async (req, res) => {
  try {
    const { couponCode, discount, startDate, endDate } = req.body;

    // Create the coupon
    const coupon = new Coupon({
      couponCode,
      discount,
      startDate,
      endDate
    });

    await coupon.save();

    res.status(201).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

exports.getAllCoupon = async (req, res) => {
  try {

    const coupons = await Coupon.find();
    return res.json(coupons);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get coupons' });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    // Find all coupons in the database
    const coupons = await Coupon.find();

    const validCoupons = coupons.filter(coupon => {
      const expirationDate = new Date(coupon.endDate);
      const currentDate = new Date();
      const isExpired = coupon.endDate && expirationDate <= currentDate;

      const isUsed = coupon.usedInBooking;

      return !isExpired && !isUsed;
    });
    return res.json({ status: 200, data: validCoupons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get coupons' });
  }
};

exports.updateCoupon = async (req, res) => {
  const { couponId } = req.params;
  const { couponCode, discount, startDate, endDate } = req.body;

  try {
    let coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    if (discount) coupon.discount = discount;
    if (startDate) coupon.startDate = startDate;
    if (endDate) coupon.endDate = endDate;
    if (couponCode) coupon.couponCode = couponCode;

    await coupon.save();

    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};


exports.deleteCoupon = async (req, res) => {
  const { couponId } = req.params;

  try {
    // Find the coupon in the database by its ID and remove it
    const result = await Coupon.findByIdAndDelete(couponId);

    if (!result) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};











