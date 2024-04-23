const express = require("express");
const auth = require("../Controller/adminController");
const authJwt = require("../middleware/authJwt");

const { offerImage } = require('../middleware/imageUpload');


const router = express.Router();

router.post("/admin/registration", auth.registration);
router.post("/admin/login", auth.signin);
router.put("/admin/update", [authJwt.isAdmin], auth.update);
router.get("/admin/profile", [authJwt.isAdmin], auth.getAllUser);
router.get("/admin/profile/:userId", [authJwt.isAdmin], auth.getUserById);
router.delete('/admin/users/profile/delete/:id', [authJwt.isAdmin], auth.deleteUser);
router.post('/admin/offers', [authJwt.isAdmin], offerImage.single('image'), auth.createOffer);
router.get('/admin/offers', /*[authJwt.isAdmin],*/ auth.getAllOffers);
router.get('/admin/offers/:offerId', /*[authJwt.isAdmin],*/ auth.getOfferById);
router.put('/admin/offers/:offerId', [authJwt.isAdmin], offerImage.single('image'), auth.updateOffer);
router.delete('/admin/offers/:offerId', [authJwt.isAdmin], auth.deleteOffer);
router.post('/admin/plans', [authJwt.isAdmin], auth.createPlan);
router.get('/admin/plans', /*[authJwt.isAdmin],*/ auth.getAllPlans);
router.get('/admin/plans/:id', /*[authJwt.isAdmin],*/ auth.getPlanById);
router.put('/admin/plans/:id', [authJwt.isAdmin], auth.updatePlan);
router.delete('/admin/plans/:id', [authJwt.isAdmin], auth.deletePlan);
router.put('/admin/subscriptions/:subscriptionId', [authJwt.isAdmin], auth.updateSubscription);
router.post('/admin/membership', [authJwt.isAdmin], auth.createMembership);
router.get('/admin/membership', auth.getMemberships);
router.get('/admin/membership/:id', auth.getMembershipById);
router.put('/admin/membership/:id', [authJwt.isAdmin], auth.updateMembership);
router.delete('/admin/membership/:id', [authJwt.isAdmin], auth.deleteMembership);
router.post('/admin/reward-points', [authJwt.isAdmin], auth.createRewardPoint);
router.get('/admin/reward-points', auth.getAllRewardPoints);
router.get('/admin/reward-points/byUserToken', [authJwt.verifyToken], auth.getAllRewardPointsByUserToken);
router.get('/admin/reward-points/:id', auth.getRewardPointById);
router.put('/admin/reward-points/:id', [authJwt.isAdmin], auth.updateRewardPoint);
router.delete('/admin/reward-points/:id', [authJwt.isAdmin], auth.deleteRewardPoint);
router.post('/admin/contact', [authJwt.isAdmin], auth.createContactInformation);
router.get('/admin/contact', auth.getAllContactInformation);
router.get('/admin/contact/:id', auth.getContactInformationById);
router.put('/admin/contact/:id', [authJwt.isAdmin], auth.updateContactInformation);
router.delete('/admin/contact/:id', [authJwt.isAdmin], auth.deleteContactInformation);
router.post('/admin/cartMinimumPrice', [authJwt.isAdmin], auth.createCartMinimumPrice);
router.get('/admin/cartMinimumPrice', auth.getCartMinimumPrice);
router.put('/admin/cartMinimumPrice', [authJwt.isAdmin], auth.updateCartMinimumPrice);
router.delete('/admin/cartMinimumPrice', [authJwt.isAdmin], auth.deleteCartMinimumPrice);
router.post('/admin-issues', [authJwt.isAdmin], auth.createAdminIssue);
router.get('/admin-issues', auth.getAllAdminIssues);
router.get('/admin-issues/:id', auth.getAdminIssueById);
router.put('/admin-issues/:id', [authJwt.isAdmin], auth.updateAdminIssue);
router.delete('/admin-issues/:id', [authJwt.isAdmin], auth.deleteAdminIssue);
router.post('/admin/packaging', [authJwt.isAdmin], auth.createPackagingCharge);
router.get('/admin/packaging', [authJwt.isAdmin], auth.getAllPackagingCharges);
router.get('/admin/packaging/:id', [authJwt.isAdmin], auth.getPackagingChargeById);
router.put('/admin/packaging/:id', [authJwt.isAdmin], auth.updatePackagingChargeById);
router.delete('/admin/packaging/:id', [authJwt.isAdmin], auth.deletePackagingChargeById);


module.exports = router;
