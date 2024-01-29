const {
    createZone,
    updateZone,
    getZone,
    removeZone,
  } = require("../Controller/zoneController");
//   const upload = require("../middleware/fileUpload");
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
 router.route("/create").post(createZone);
  router.route("/all").get(getZone);
  router.route("/update/:id").put(  updateZone);
  router.route("/remove/:id").delete(removeZone);
  
  module.exports = router;