const express = require("express");
const {
  createAddress,
  getAddressById,
  updateAddress,
  updateAddressInTip,
  deleteAddress,
  getAll,
} = require("../Controller/addressController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.route("/new").post(authJwt.verifyToken, createAddress);

router.route("/getAddress").get(authJwt.verifyToken, getAddressById);

router.route("/address/:id").put(authJwt.verifyToken, updateAddress);
router.route("/address/tip/:id").put(authJwt.verifyToken, updateAddressInTip);
router.route("/address/:id").delete(authJwt.verifyToken, deleteAddress);
router.route("/address/all").get(getAll);

module.exports = router;
