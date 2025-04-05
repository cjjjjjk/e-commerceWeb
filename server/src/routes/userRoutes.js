const express = require("express");
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.get("/", userController.getUsers);
router.post("/google-signin", userController.googleSignIn);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
