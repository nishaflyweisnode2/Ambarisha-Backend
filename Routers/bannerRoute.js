const express = require('express');
const bannerControllers = require('../Controller/bannerController');
const { upload } = require("../middleware/imageUpload");
// const upload = multer({ dest: 'uploads/' }); // Update the destination folder as needed
const router = express();
const authJwt = require("../middleware/authJwt");

router.post('/', [upload.single("image"), bannerControllers.AddBanner]);
router.get('/type/:type', [bannerControllers.getbannerbyType]);

router.get('/', [bannerControllers.getBanner]);
router.put('/update/:id', [upload.single("image"), bannerControllers.updateBanner]);

router.delete('/delete/:id', [bannerControllers.removeBanner])

router.get('/banners/category/:categoryId', bannerControllers.getBannersByCategory);

router.get('/banners/subCategory/:subCategoryId', bannerControllers.getBannersBySubCategory);

router.get('/banners/product/:productId', bannerControllers.getBannersByProduct);



module.exports = router;