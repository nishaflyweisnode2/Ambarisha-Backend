const User = require("../Models/userModel");
const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
const City = require('../Models/cityModel');
const SuggestedProduct = require('../Models/suggestedProductModel');
const RecycleBin = require('../Models/recycleBagmodel');
const Holiday = require('../Models/holidayModel');



// const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const randomatic = require('randomatic');
// const twilio = require('twilio');

// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
cloudinary.config({
  cloud_name: 'dtijhcmaa',
  api_key: '624644714628939',
  api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY'
});

const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = '';
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
}

exports.registerUser = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const existingUser = await User.findOne({ mobileNumber, role: 'user' });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    // Generate OTP
    // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    const otp = randomatic('0', 4);
    // Save the generated OTP to the user's record in the database
    const user = await User.findOneAndUpdate(
      { mobileNumber, reffralCode: await reffralCode() },
      { otp },
      { new: true, upsert: true }
    );

    // Send OTP via SMS using Twilio
    // ...

    return res.json({ status: 201, message: 'OTP sent successfully', data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
};

exports.verifyOtp = async (req, res) => {

  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // console.log(mobileNumber);
    // console.log(otp);
    // Fetch the user's record from the database based on the mobile number
    const user = await User.findOne({ mobileNumber });
    // console.log(user);
    if (!user) {
      // User not found, handle accordingly
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the provided OTP matches the one saved in the user's record
    if (user.otp !== otp) {
      // Invalid OTP, handle accordingly
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, save the user in the database
    user.isVerified = true;
    await user.save();

    // Check if the user is verified
    if (user.isVerified) {
      // Generate a JWT token
      // const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      return res.json({ status: 200, message: 'OTP verification successful.', data: token, user });
    } else {
      return res.status(401).json({ status: 401, message: 'User not verified' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {

  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    // const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    const otp = randomatic('0', 4);

    console.log(otp);
    // Save the OTP to the user's record in the database
    user.otp = otp;
    await user.save();

    // Send the OTP to the user (e.g., via SMS, email, etc.)
    // ...

    return res.json({ status: 200, message: 'OTP generated and sent to the user', data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
};

exports.verifyOtplogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find the user based on the mobile number
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the OTP matches
    if (otp === user.otp) {
      // Generate a JWT token
      //   const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      // Clear the OTP from the user's record in the database
      user.otp = undefined;
      await user.save();

      return res.json({ status: 200, message: 'OTP verification successful.', data: user, token });
    } else {
      return res.status(401).json({ status: 401, error: 'Invalid OTP' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).send({ status: 404, message: "user not found ", data: {}, });
    } else {
      return res.status(200).send({ status: 200, message: "get profile ", data: user, });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({ status: 404, message: "User not found" });
    }

    let updateFields = {};

    if (req.body.currentLat || req.body.currentLong) {
      const coordinates = [parseFloat(req.body.currentLat), parseFloat(req.body.currentLong)];
      updateFields.currentLocation = { type: "Point", coordinates };
    }

    if (req.body.state) {
      updateFields.state = req.body.state;
      updateFields.isState = true;
    }

    if (req.body.city) {
      updateFields.city = req.body.city;
      updateFields.isCity = true;
    }

    if (req.body.pincode) {
      const city = await City.findOne({ pincode: req.body.pincode });
      if (city) {
        updateFields.city = city._id;
        updateFields.pincode = req.body.pincode;
        updateFields.isCity = true;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: updateFields },
      { new: true }
    );

    if (updatedUser) {
      let obj = {
        currentLocation: updatedUser.currentLocation,
        state: updatedUser.state,
        city: updatedUser.city,
        pincode: updatedUser.pincode
      };
      return res.status(200).send({ status: 200, message: "Location update successful.", data: obj });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};

exports.allUser = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({ status: 200, success: true, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, success: false, message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete the user
    await User.deleteOne({ _id: userId });

    return res.status(200).json({ status: 200, success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, success: false, message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const findUser = await User.findById({ _id: req.user._id });

    if (!findUser) {
      return res.status(404).json({ msg: 'User not found', user: {} });
    }

    let fileUrl;

    if (req.file) {
      fileUrl = req.file ? req.file.path : '';
    }

    const data = {
      name: req.body.name || findUser.name,
      email: req.body.email || findUser.email,
      // phone: req.body.phone || findUser.phone,
      address: req.body.address || findUser.address,
      image: fileUrl || findUser.image,
    };

    const user = await User.findByIdAndUpdate({ _id: req.user._id }, data, {
      new: true,
    });

    return res.status(200).json({ status: 200, msg: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 500, message: 'Server error' + error.message });
  }
};

exports.createSuggestedProduct = async (req, res) => {
  try {
    const { productName } = req.body;
    const userId = req.user.id;

    const suggestedProduct = new SuggestedProduct({
      productName,
      user: userId,
    });

    await suggestedProduct.save();

    return res.status(201).json({ message: 'Suggested product created successfully', data: suggestedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.getAllSuggestedProducts = async (req, res) => {
  try {
    const suggestedProducts = await SuggestedProduct.find().populate('user', 'username email'); // Assuming user has 'username' and 'email' fields

    return res.status(200).json({ status: 200, message: 'Suggested products retrieved successfully', data: suggestedProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.getSuggestedProductById = async (req, res) => {
  try {
    const suggestedProduct = await SuggestedProduct.findById(req.params.productId).populate('user', 'username email');

    if (!suggestedProduct) {
      return res.status(404).json({ message: 'Suggested product not found', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Suggested product retrieved successfully', data: suggestedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.updateSuggestedProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    const suggestedProduct = await SuggestedProduct.findByIdAndUpdate(req.params.productId, { productName }, { new: true });

    if (!suggestedProduct) {
      return res.status(404).json({ message: 'Suggested product not found', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Suggested product updated successfully', data: suggestedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.deleteSuggestedProduct = async (req, res) => {
  try {
    const deletedProduct = await SuggestedProduct.findByIdAndDelete(req.params.productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Suggested product not found', data: null });
    }

    return res.status(200).json({ status: 200, message: 'Suggested product deleted successfully', data: deletedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

exports.addToRecycleBin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bag } = req.body;

    const recycleBin = await RecycleBin.create({
      user: userId,
      bag: bag,
      voucherAmount: 0,
      status: 'Pending'
    });

    return res.status(201).json({ status: 201, message: 'Item added to recycle bin. Waiting for voucher approval.', data: recycleBin });
  } catch (error) {
    console.error('Error adding item to recycle bin:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.getRecycleBinItemsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const recycleBinItems = await RecycleBin.find({ user: userId });

    return res.status(200).json({ status: 200, message: 'Recycle bin items retrieved', data: recycleBinItems });
  } catch (error) {
    console.error('Error retrieving recycle bin items:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};
exports.getAllRecycleBinItems = async (req, res) => {
  try {
    const recycleBinItems = await RecycleBin.find();

    return res.status(200).json({ status: 200, message: 'Recycle bin items retrieved', data: recycleBinItems });
  } catch (error) {
    console.error('Error retrieving recycle bin items:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.approveVoucher = async (req, res) => {
  try {
    const { itemId } = req.params
    const { voucherAmount } = req.body;

    const recycleBinItem = await RecycleBin.findById(itemId);

    if (!recycleBinItem) {
      return res.status(404).json({ status: 404, message: 'Recycle bin item not found' });
    }

    recycleBinItem.voucherAmount = voucherAmount;
    recycleBinItem.status = 'Approved';
    await recycleBinItem.save();

    return res.status(200).json({ status: 200, message: 'Voucher amount approved successfully', data: recycleBinItem });
  } catch (error) {
    console.error('Error approving voucher amount:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.deleteRecycleBinItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const deletedItem = await RecycleBin.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ status: 404, message: 'Recycle bin item not found' });
    }

    return res.status(200).json({ status: 200, message: 'Recycle bin item deleted', data: deletedItem });
  } catch (error) {
    console.error('Error deleting recycle bin item:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

exports.createHoliday = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const holiday = await Holiday.create({ startDate, endDate });
    return res.status(201).json({ status: 201, message: 'Holiday created successfully', data: holiday });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    return res.status(200).json({ status: 200, data: holidays });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

exports.updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;
    const holiday = await Holiday.findByIdAndUpdate(id, { startDate, endDate }, { new: true });
    if (!holiday) {
      return res.status(404).json({ status: 404, message: 'Holiday not found' });
    }
    return res.status(200).json({ status: 200, message: 'Holiday updated successfully', data: holiday });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) {
      return res.status(404).json({ status: 404, message: 'Holiday not found' });
    }
    return res.status(200).json({ status: 200, message: 'Holiday deleted successfully', data: holiday });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
};
