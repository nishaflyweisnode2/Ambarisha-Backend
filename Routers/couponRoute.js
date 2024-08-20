const express = require('express'); 
const couponControllers = require('../Controller/couponController');

const router = express();
const authJwt = require("../middleware/authJwt");

router.post('/',[ couponControllers.AddCoupon]);
router.get('/',[  [authJwt.verifyToken], couponControllers.getCoupon]);
router.get('/all',[  couponControllers.getAllCoupon]);
router.put('/update/:couponId',[  couponControllers.updateCoupon]);

router.delete('/:couponId',[ couponControllers.deleteCoupon])


module.exports = router;