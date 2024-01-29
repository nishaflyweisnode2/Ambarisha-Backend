const express = require("express");
const {
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAll,
} = require("../Controller/addressController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.route("/new").post(authJwt.verifyToken, createAddress);

router.route("/getAddress").get(authJwt.verifyToken, getAddressById);

router.route("/address/:id").put(updateAddress);
router.route("/address/:id").delete(deleteAddress);
router.route("/address/all").get(getAll);

module.exports = router;
