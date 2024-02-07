const express = require('express');
const router = express.Router();
const subscriptionController = require('../Controller/userSubscriptionController');


const authJwt = require("../middleware/authJwt");



router.post('/subscriptions/create', [authJwt.verifyToken], subscriptionController.createSubscription);
router.get('/subscriptions', subscriptionController.getSubscription);
router.get('/subscriptions/:subscriptionId', subscriptionController.getSubscriptionById);
router.put('/subscriptions/:subscriptionId', [authJwt.verifyToken],subscriptionController.updateSubscription);
router.delete('/subscriptions/:subscriptionId', [authJwt.verifyToken], subscriptionController.deleteSubscription);

module.exports = router;
