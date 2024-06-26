const express = require("express");
const {
    addandremoveMoney,
  myWallet,
  AllWalletTransction
} = require("../Controller/walletController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();
router.route("/money").post(authJwt.verifyToken, addandremoveMoney);
router.route("/me").get(authJwt.verifyToken, myWallet);
router.route("/all").get(authJwt.isAdmin, AllWalletTransction);

module.exports = router;
