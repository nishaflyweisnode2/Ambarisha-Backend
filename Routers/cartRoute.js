const express = require('express');
const cartControllers = require('../Controller/cartController');
const router = express();
const authJwt = require("../middleware/authJwt");

router.post('/add', [authJwt.verifyToken, cartControllers.addToCart]);

router.post('/applycoupon', [authJwt.verifyToken, cartControllers.applyCoupon]);
router.get('/', [authJwt.verifyToken, cartControllers.getCart]);

router.put('/increase', [authJwt.verifyToken, cartControllers.updateCartItemQuantity]);

router.delete("/remove/:productId", authJwt.verifyToken, cartControllers.removeCartItem);
router.post('/removeCoupon', [authJwt.verifyToken, cartControllers.removeCoupon]);
router.put('/cart/address', [authJwt.verifyToken, cartControllers.updateCartAddress]);
router.put('/cart/membership', [authJwt.verifyToken, cartControllers.addMembershipToCart]);
router.put('/cart/subscription', [authJwt.verifyToken, cartControllers.addSubscriptionToCart]);


module.exports = router;