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


module.exports = router;
