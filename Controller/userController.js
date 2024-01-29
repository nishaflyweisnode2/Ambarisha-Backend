const User = require("../Models/userModel");
const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
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
          { mobileNumber },
          { otp },
          { new: true, upsert: true }
        );
    
        // Send OTP via SMS using Twilio
        // ...
    
        res.json({ message: 'OTP sent successfully',user });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.json({ message: 'OTP verification successful.', token,user });
      } else {
        res.status(401).json({ error: 'User not verified' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
  
      res.json({ message: 'OTP generated and sent to the user',user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    
          res.json({ message: 'OTP verification successful.',user, token });
        } else {
          res.status(401).json({ error: 'Invalid OTP' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    exports.getUserDetails = async (req, res) => {
        try {
          const user = await User.findById(req.user._id);
          if (!user) {
            res.status(404).send({ status: 404, message: "user not found ", data: {}, });
          } else {
            res.status(200).send({ status: 200, message: "get profile ", data: user, });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        }
      };
    
      exports.allUser = async (req, res) => {

      try {
        // Find all users
        const users = await User.find();
    
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
    
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
          uploadSelfie: fileUrl || findUser.uploadSelfie,
        };
    
        const user = await User.findByIdAndUpdate({ _id: req.user._id }, data, {
          new: true,
        });
    
        return res.status(200).json({ msg: 'Profile updated successfully', user });
      } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: 'Server error' + error.message });
      }
    };