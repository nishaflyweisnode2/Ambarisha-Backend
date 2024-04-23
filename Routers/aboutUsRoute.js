const express = require("express");
const auth = require("../Controller/aboutUsController");

const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.post('/admin/AboutApps', [authJwt.isAdmin], auth.createAboutApps);
router.get('/admin/AboutApps', /*[authJwt.isAdmin],*/ auth.getAllAboutApps);
router.get('/admin/AboutApps/:id', /*[authJwt.isAdmin],*/ auth.getAboutAppsById);
router.put('/admin/AboutApps/:id', [authJwt.isAdmin], auth.updateAboutAppsById);
router.delete('/admin/AboutApps/:id', [authJwt.isAdmin], auth.deleteAboutAppsById);


module.exports = router;
