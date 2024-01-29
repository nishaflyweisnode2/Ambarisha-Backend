const {
  createFaq,
  updateFaq,
  getFaq,
  removeFaq,
} = require("../Controller/faqController");
//   const upload = require("../middleware/fileUpload");
const authJwt = require("../middleware/authJwt");
// const auth = require("../middleware/authSeller");
const router = require("express").Router();

router.route("/create").post(createFaq);
router.route("/all").get(getFaq);
router.route("/update/:id").put(updateFaq);
router.route("/remove/:id").delete(removeFaq);

module.exports = router;
