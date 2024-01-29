const {
    createApartment,
    updateApartment,
    getApartment,
    removeApartment,
  } = require("../Controller/apartmentController");
//   const upload = require("../middleware/fileUpload");
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
 router.route("/create").post(createApartment);
  router.route("/all").get(getApartment);
  router.route("/update/:id").put(  updateApartment);
  router.route("/remove/:id").delete(removeApartment);
  
  module.exports = router;