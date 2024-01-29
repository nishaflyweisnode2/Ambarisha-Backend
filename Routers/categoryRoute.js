const {
    createCategory,
    updateCategory,
    getCategories,
    removeCategory,
    addDiscount,
    getDiscountedCategories
  } = require("../Controller/categoryController");
//   const upload = require("../middleware/fileUpload");
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
  router.route("/create").post(  createCategory);
  router.route("/all").get(  getCategories);
  router.route("/update/:id").put(  updateCategory);
  router.route("/remove/:id").delete( removeCategory);
  router.route("/add/discount/:categoryId").put( addDiscount);
  router.route("/get/discounted").get( getDiscountedCategories);
  
  module.exports = router;