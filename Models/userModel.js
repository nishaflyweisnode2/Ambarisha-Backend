const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
  },
  uploadSelfie: {
    type: String,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  language: {
    type: String
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,

  },
  profileImage: {
    type: String,
    default: null,
  },
  userType: {
    type: String,
    enum: ['USER', 'ADMIN', 'VENDOR', 'WAREHOUSE', 'Driver'],
    default: 'User',
  },
  otp: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;