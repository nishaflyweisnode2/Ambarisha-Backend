const express = require("express");
const {
  registerUser, loginUser,allUser,registerAdmin,verifyAdmin,deleteUser, loginAdmin,logout,verifyadminlogin, getUserDetails, verifyOtp,verifyOtplogin,updateProfile
} = require("../Controller/userController");
const { upload } = require("../middleware/imageUpload");

const authJwt = require("../middleware/authJwt");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/verify/otp").post(verifyOtp);

router.route("/login").post(loginUser);
router.route("/verify/login").post(verifyOtplogin);

router.route("/user/all").get( allUser);
router.route("/delete/user/:userId").delete( deleteUser);

router.route("/me").get(authJwt.verifyToken, getUserDetails);
router.route("/update/profile").put(authJwt.verifyToken,upload.single('selfie'), updateProfile);
module.exports = router;