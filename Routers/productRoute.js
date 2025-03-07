const express = require("express");

const {
  createProduct,
  allProduct,
  singleProduct,
  updateProducts,
  deleteProducts,
  productbyCategory,
  productbysubCategory,
  updateType,
  createWishlist,
  removeFromWishlist,
  myWishlist,
  productDiscount,
  getDiscountedProducts,
  getProductsByType,
  getProductsByCategoryAndSubcategory,
  addProductReview,
  getProductsByDemand,
  createProductOffer,
  getProductOffers,
  updateProductOffer,
  deleteProductOffer,
  getAllProductsWithOffers,
  paginateProductSearch,
  createSubscriptionForProduct,
} = require("../Controller/productController");
const authJwt = require("../middleware/authJwt");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authJwt");
const router = express.Router();
router.route("/new").post(createProduct);
router.route("/product/discount/:productId").put(productDiscount);
router.route("/get/discount/product").get(getDiscountedProducts);


router.route("/all").get(allProduct);
router.route("/single/:productId").get(singleProduct);
router.route("/update/:id").put(updateProducts);
router.route("/category/:categoryId").get(productbyCategory);
router.route("/sub/category/:subcategoryId").get(productbysubCategory);
router.route("/update/type/:productId").put(updateType);
router.route("/product/by/type/:type").get(getProductsByType);


router.route("/add/wishlist/:id").post(authJwt.verifyToken, createWishlist);
router.route("/remove/wishlist/:id").put(authJwt.verifyToken, removeFromWishlist);

router.route("/wishlist/me").get(authJwt.verifyToken, myWishlist);

router.route("/delete/:id").delete(deleteProducts);

router.get('/products/:category/:subcategory', [authJwt.verifyToken], getProductsByCategoryAndSubcategory);

router.post('/products/:productId/reviews', [authJwt.verifyToken], addProductReview);

router.get('/products/most-demand', [authJwt.verifyToken], getProductsByDemand);

router.post('/products/offers', [authJwt.isAdmin], createProductOffer);

router.get('/products/:productId/get/offers', getProductOffers);

router.put('/products/:productId/offers/:offerId', [authJwt.isAdmin], updateProductOffer);

router.delete('/products/:productId/offers/:offerId', [authJwt.isAdmin], deleteProductOffer);

router.get('/products/all/offers/product', getAllProductsWithOffers);

router.get("/product/all/paginateProductSearch", paginateProductSearch);

router.post("/create-subscriptions", createSubscriptionForProduct);




module.exports = router;
