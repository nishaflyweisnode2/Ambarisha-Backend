const express = require("express");
const auth = require("../Controller/adminController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();

router.post("/admin/registration", auth.registration);
router.post("/admin/login", auth.signin);
router.put("/admin/update", [authJwt.isAdmin], auth.update);
router.get("/admin/profile", [authJwt.isAdmin], auth.getAllUser);
router.get("/admin/profile/:userId", [authJwt.isAdmin], auth.getUserById);
router.delete('/admin/users/profile/delete/:id', [authJwt.isAdmin], auth.deleteUser);

module.exports = router;
