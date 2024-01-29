const express = require("express");
const orderControllers = require("../Controller/orderController");
const router = express();
const authJwt = require("../middleware/authJwt");

router.get("/all", [orderControllers.allOrder]);
router.get("/single/:orderId", [orderControllers.singleOrder]);
router.get("/my", [authJwt.verifyToken,orderControllers.myOrder]);
router.put("/status/:orderId", [orderControllers.orderStatus]);
router.get("/order/category", [authJwt.verifyToken,orderControllers.getAllOrdersCategories]);

// for admin
router.get("/onetime/all", [orderControllers.onetimeAll]);
router.get("/daily/all", [orderControllers.dailyAll]);
router.get("/weekly/all", [orderControllers.weeklyAll]);
router.get("/weekend/all", [orderControllers.weekendAll]);
router.get("/alternate/all", [orderControllers.alternateAll]);

// for user
router.get("/onetime/user", [authJwt.verifyToken,orderControllers.onetimeUser]);
router.get("/daily/user", [authJwt.verifyToken,orderControllers.dailyUser]);
router.get("/weekly/user", [authJwt.verifyToken,orderControllers.weeklyUser]);
router.get("/weekend/user", [authJwt.verifyToken,orderControllers.weekendUser]);
router.get("/alternate/user", [authJwt.verifyToken,orderControllers.alternateUser]);

// router.post('/order/at/midnight',[ authJwt.verifyToken,orderControllers.midnightOrder]);

module.exports = router;
