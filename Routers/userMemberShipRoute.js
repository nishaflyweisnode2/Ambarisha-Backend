const express = require('express');
const router = express.Router();
const userMembershipController = require('../Controller/userMemberShipController');

const authJwt = require("../middleware/authJwt");


router.post('/user-memberships', [authJwt.verifyToken], userMembershipController.createUserMembership);
router.get('/user-memberships', [authJwt.isAdmin], userMembershipController.getAllUserMemberships);
router.get('/user-memberships/byUser', [authJwt.verifyToken], userMembershipController.getAllUserMembershipsByToken);
router.get('/user-memberships/:id', userMembershipController.getUserMembershipById);
router.put('/user-memberships/:id', [authJwt.verifyToken], userMembershipController.updateUserMembershipById);
router.delete('/user-memberships/:id', [authJwt.verifyToken], userMembershipController.deleteUserMembershipById);
router.post('/user-wallet/apply-wallet', [authJwt.verifyToken], userMembershipController.applyWalletToUserMembership);



module.exports = router;
