const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Address = require("../Models/addressModel");

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
    const address = await Address.create({ user: req.user.id, ...req.body });
    res.status(201).json({
      success: true,
      address,
    });
  });
  

exports.getAddressById = catchAsyncErrors(async (req, res, next) => {
  const allAddress = await Address.find({ user: req.user._id }).populate("user").populate("appartment");
  res.status(201).json({
    success: true,
    allAddress,
  });
});

exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  const newAddressData = req.body;

  await Address.findByIdAndUpdate(req.params.id, newAddressData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
    const address = await Address.findByIdAndDelete(req.params.id);
  
    if (!address) {
      return next(
        new ErrorHander(`Address does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  });
exports.getAll = catchAsyncErrors(async (req, res, next) => {
    const addresses = await Address.find().populate("user").populate("appartment");;

    res.status(200).json({
      success: true,
      addresses,
    });
  });