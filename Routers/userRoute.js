const express = require("express");
const {
  registerUser, loginUser, allUser, registerAdmin, verifyAdmin, deleteUser, loginAdmin, logout, verifyadminlogin, getUserDetails, verifyOtp, verifyOtplogin, updateProfile, updateLocation, createSuggestedProduct, getAllSuggestedProducts, getSuggestedProductById, updateSuggestedProduct, deleteSuggestedProduct, addToRecycleBin, getRecycleBinItemsByUser, getAllRecycleBinItems, approveVoucher, deleteRecycleBinItem, createHoliday, getAllHolidays, updateHoliday, deleteHoliday
} = require("../Controller/userController");
const { upload } = require("../middleware/imageUpload");

const authJwt = require("../middleware/authJwt");
const router = express.Router();


router.route("/register").post(registerUser);

router.route("/verify/otp").post(verifyOtp);

router.route("/login").post(loginUser);

router.route("/verify/login").post(verifyOtplogin);

router.route("/user/all").get(allUser);

router.route("/delete/user/:userId").delete(deleteUser);

router.route("/me").get(authJwt.verifyToken, getUserDetails);

router.route("/update/profile").put(authJwt.verifyToken, upload.single('selfie'), updateProfile);

router.put("/updateLocation", [authJwt.verifyToken], updateLocation);

router.post('/suggested-products', [authJwt.verifyToken], createSuggestedProduct);

router.get('/suggested-products', [authJwt.verifyToken], getAllSuggestedProducts);

router.get('/suggested-products/:productId', [authJwt.verifyToken], getSuggestedProductById);

router.put('/suggested-products/:productId', [authJwt.verifyToken], updateSuggestedProduct);

router.delete('/suggested-products/:productId', [authJwt.verifyToken], deleteSuggestedProduct);

router.post('/recycle-bin', [authJwt.verifyToken], addToRecycleBin);

router.get('/recycle-bin', [authJwt.verifyToken], getRecycleBinItemsByUser);

router.get('/getAll/recycle-bin', /*[authJwt.verifyToken],*/ getAllRecycleBinItems);

router.put('/recycle-bin/:itemId', [authJwt.isAdmin], approveVoucher);

router.delete('/recycle-bin/:itemId', deleteRecycleBinItem);

router.post('/holidays', [authJwt.verifyToken], createHoliday);

router.get('/holidays', getAllHolidays);

router.put('/holidays/:id', [authJwt.verifyToken], updateHoliday);

router.delete('/holidays/:id', [authJwt.verifyToken], deleteHoliday);


module.exports = router;