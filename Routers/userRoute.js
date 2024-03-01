const express = require("express");
const {
  registerUser, loginUser, allUser, registerAdmin, verifyAdmin, deleteUser, loginAdmin, logout, verifyadminlogin, socialLogin, getUserDetails, verifyOtp, verifyOtplogin, updateProfile, updateLocation, createSuggestedProduct, getAllSuggestedProducts, getSuggestedProductById, updateSuggestedProduct, deleteSuggestedProduct, addToRecycleBin, getRecycleBinItemsByUser, getAllRecycleBinItems, approveVoucher, deleteRecycleBinItem, createHoliday, getAllHolidays, getAllHolidaysByUserToken, updateHoliday, deleteHoliday, updateUserNotifications, deleteAccount, verifyOtpForDelete, resendOTPForDelete, createUserOrderIssue, getAllUserOrderIssues, getUserOrderIssueById, updateUserOrderIssue, deleteUserOrderIssue, getAllUserOrderByIssues
} = require("../Controller/userController");
const { upload } = require("../middleware/imageUpload");

const authJwt = require("../middleware/authJwt");
const router = express.Router();


router.route("/register").post(registerUser);

router.route("/verify/otp").post(verifyOtp);

router.route("/login").post(loginUser);

router.route("/verify/login").post(verifyOtplogin);

router.route("/socialLogin").post(socialLogin);

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
router.get('/holidays/bytoken', [authJwt.verifyToken], getAllHolidaysByUserToken);

router.put('/holidays/:id', [authJwt.verifyToken], updateHoliday);

router.delete('/holidays/:id', [authJwt.verifyToken], deleteHoliday);

router.put('/users/notifications', [authJwt.verifyToken], updateUserNotifications);

router.delete('/user/delete-account', [authJwt.verifyToken], deleteAccount);
router.post("/user/delete-account/:id", [authJwt.verifyToken], verifyOtpForDelete);
router.post("/user/resendOtp/delete-account/:id", [authJwt.verifyToken], resendOTPForDelete);

router.post('/user-order-issues', [authJwt.verifyToken], createUserOrderIssue);
router.get('/user-order-issues', [authJwt.isAdmin], getAllUserOrderIssues);
router.get('/single-user-order-issues', [authJwt.verifyToken], getAllUserOrderByIssues);
router.get('/user-order-issues/:id', [authJwt.verifyToken], getUserOrderIssueById);
router.put('/user-order-issues/:id', [authJwt.isAdmin], updateUserOrderIssue);
router.delete('/user-order-issues/:id', [authJwt.verifyToken], deleteUserOrderIssue);




module.exports = router;