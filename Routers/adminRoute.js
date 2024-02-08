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
router.get('/admin/reward-points/byUserToken',[authJwt.verifyToken], auth.getAllRewardPointsByUserToken);
router.get('/admin/reward-points/:id', auth.getRewardPointById);
router.put('/admin/reward-points/:id', [authJwt.isAdmin], auth.updateRewardPoint);
router.delete('/admin/reward-points/:id', [authJwt.isAdmin], auth.deleteRewardPoint);


module.exports = router;
