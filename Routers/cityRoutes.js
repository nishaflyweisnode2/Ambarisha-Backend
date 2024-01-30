require('dotenv').config()
const express = require('express');
const router = express.Router();

const auth = require('../Controller/cityController');
const authJwt = require("../middleware/authJwt");

const { cityImage } = require('../middleware/imageUpload');


router.post("/admin/city/cities", [authJwt.isAdmin], cityImage.single('image'), auth.createCity);
router.get("/admin/city/cities", [authJwt.isAdmin], auth.getAllCities);
router.get("/admin/city/cities/:id", [authJwt.isAdmin], auth.getCityById);
router.put("/admin/city/cities/:id", [authJwt.isAdmin], cityImage.single('image'), auth.updateCityById);
router.delete("/admin/city/cities/:id", [authJwt.isAdmin], auth.deleteCityById);




router.all("/*", (req, res) => { res.status(400).send({ status: false, message: "Endpoint is not correct plese provide a proper end-point" }) })


module.exports = router;