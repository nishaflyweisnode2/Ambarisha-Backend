const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["home", "office", "other"],
    default: "home",
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
  },
  block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TowerBlock",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  block1: {
    type: String,
  },
  floor: {
    type: String,
  },
  flatNo: {
    type: String,
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
  tip: {
    type: Number,
    default: 0,
  },
  isTipForAllOrder: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", addressSchema);
