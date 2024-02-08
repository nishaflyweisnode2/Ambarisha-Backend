const auth = require("../Controller/apartmentController");
//   const upload = require("../middleware/fileUpload");
const authJwt = require("../middleware/authJwt");
// const auth = require("../middleware/authSeller");
const router = require("express").Router();

// Apartment
router.route("/create").post([authJwt.isAdmin], auth.createApartment);
router.route("/all").get(auth.getApartment);
router.route("/all/:cityId").get(auth.getApartmentByCityId);
router.route("/update/:id").put([authJwt.isAdmin], auth.updateApartment);
router.route("/remove/:id").delete([authJwt.isAdmin], auth.removeApartment);

//Tower
router.route("/tower/create").post([authJwt.isAdmin], auth.createTowerBlock);
router.route("/tower/all").get(auth.getTowerBlock);
router.route("/tower/all/:cityId").get(auth.getTowerBlockByCityId);
router.route("/tower/all/apartment/:apartmentId").get(auth.getTowerBlockByApartmentId);
router.route("/tower/update/:id").put([authJwt.isAdmin], auth.updateTowerBlock);
router.route("/tower/remove/:id").delete([authJwt.isAdmin], auth.removeTowerBlock);

module.exports = router;