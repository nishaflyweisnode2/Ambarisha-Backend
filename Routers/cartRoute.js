const express = require('express'); 
const cartControllers = require('../Controller/cartController');
const router = express();
const authJwt = require("../middleware/authJwt");

router.post('/add',[ authJwt.verifyToken,cartControllers.AddCart]);

router.post('/applycoupon',[ authJwt.verifyToken,cartControllers.applyCoupon]);
router.get('/',[  authJwt.verifyToken, cartControllers.getCart]);

router.put('/increase/:productId',[  authJwt.verifyToken, cartControllers.increaseQuantity]);
router.put('/decrease/:productId',[  authJwt.verifyToken, cartControllers.decreaseQuantity]);

router.delete("/remove/:productId",  authJwt.verifyToken, cartControllers.removeSingle);
router.delete("/remove/cart/all",  authJwt.verifyToken, cartControllers.removeAllcart);


module.exports = router;