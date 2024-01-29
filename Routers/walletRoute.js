const express = require("express");
const {
    addandremoveMoney,
  myWallet,
} = require("../Controller/walletController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();
router.route("/money").post(authJwt.verifyToken, addandremoveMoney);
router.route("/me").get(authJwt.verifyToken, myWallet);

module.exports = router;
