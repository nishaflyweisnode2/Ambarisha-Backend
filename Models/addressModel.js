const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "office", "other"],
    default: "other", // You can set a default type if needed
  },
  appartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  block: {
    type: String,
    required: [true, "address required"],
  },
  floor: {
    type: String,
    required: [true, "City is must"],
  },
  flatNo: {
    type: String,
    required: [true, "State Must"],
  },
  avoidCalling: {
    type: Boolean,
    default: false,
  },
  ringBell: {
    type: Boolean,
    default: false,
  },
  drop: {
    type: Boolean,
    default: false,
  },
  guard: {
    type: Boolean,
    default: false,
  },
  doorstep: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", addressSchema);
