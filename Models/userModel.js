const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
  },
  image: {
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
  userType: {
    type: String,
    enum: ['USER', 'ADMIN', 'VENDOR', 'WAREHOUSE', 'DRIVER'],
    default: 'USER',
  },
  otp: {
    type: String
  },
  currentLocation: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
  state: {
    type: String
  },
  isState: {
    type: String,
    default: false
  },
  city: { type: mongoose.Schema.ObjectId, ref: 'City' },
  isCity: {
    type: String,
    default: false
  },
  pincode: {
    type: String,
  },
  refferalCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  coin: {
    type: Number,
    default: 0,
  },
  reffralCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;