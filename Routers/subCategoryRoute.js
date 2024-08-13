const {
  createSubcategory,
  updateSubcategory,
  getSubcategories,
  removeSubcategory,
  getsubofCat
} = require("../Controller/subCategoryController");
//   const upload = require("../middleware/fileUpload");
const authJwt = require("../middleware/authJwt");
// const auth = require("../middleware/authSeller");
const router = require("express").Router();

router.route("/create").post(createSubcategory);
router.route("/all").get(getSubcategories);
router.route("/update/:id").put(updateSubcategory);
router.route("/remove/:id").delete(removeSubcategory);

router.route("/cat/:categoryId").get(getsubofCat);

module.exports = router;