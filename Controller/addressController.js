const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Address = require("../Models/addressModel");
const Apartment = require("../Models/apartmentModel");
require('dotenv').config();
const City = require('../Models/cityModel');
const TowerBlock = require('../Models/blockTowerModel');




exports.createAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.body.apartment) {
      const apartment = await Apartment.findById(req.body.apartment);
      if (!apartment) {
        return res.status(404).json({ success: false, message: `Apartment not found with ID: ${req.body.apartment}` });
      }
    }

    if (req.body.block) {
      const block = await TowerBlock.findById(req.body.block);
      if (!block) {
        return res.status(404).json({ success: false, message: `Tower block not found with ID: ${req.body.block}` });
      }
      if (req.body.apartment && block.apartment && block.apartment.toString() !== req.body.apartment) {
        return res.status(400).json({ success: false, message: 'Apartment ID does not match tower block apartment ID' });
      }
    }

    const address = await Address.create({ user: req.user.id, ...req.body });
    res.status(201).json({
      status: 201,
      data: address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

exports.getAddressById = catchAsyncErrors(async (req, res, next) => {
  const allAddress = await Address.find({ user: req.user._id }).populate("user").populate("apartment").populate("block");
  res.status(200).json({
    status: 200,
    data: allAddress,
  });
});

exports.updateAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const newAddressData = req.body;
    const addressId = req.params.id;

    const existingAddress = await Address.findById(addressId);

    if (!existingAddress) {
      return res.status(404).json({
        status: 404,
        message: 'Address not found',
      });
    }

    const modifiedFields = {};
    for (const [key, value] of Object.entries(newAddressData)) {
      if (existingAddress[key] !== value) {
        modifiedFields[key] = value;
      }
    }

    if (Object.keys(modifiedFields).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No fields to update',
      });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      modifiedFields,
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
      status: 200,
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

exports.updateAddressInTip = catchAsyncErrors(async (req, res, next) => {
  try {
    const newAddressData = req.body;
    const addressId = req.params.id;

    const existingAddress = await Address.findById(addressId);

    if (!existingAddress) {
      return res.status(404).json({
        status: 404,
        message: 'Address not found',
      });
    }

    const modifiedFields = {};
    for (const [key, value] of Object.entries(newAddressData)) {
      if (existingAddress[key] !== value) {
        modifiedFields[key] = value;
      }
    }

    if (Object.keys(modifiedFields).length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'No fields to update',
      });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      modifiedFields,
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
      status: 200,
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

exports.deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const address = await Address.findByIdAndDelete(req.params.id);

  if (!address) {
    return next(
      new ErrorHander(`Address does not exist with Id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    status: 200,
    message: "Address Deleted Successfully",
  });
});

exports.getAll = catchAsyncErrors(async (req, res, next) => {
  const addresses = await Address.find().populate("user").populate("apartment block");;

  res.status(200).json({
    status: 200,
    addresses,
  });
});