const express = require("express");
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/google-signin", userController.googleSignIn);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMe", userController.updateMe);
router.patch("/updateMyPassword", authController.updatePassword);

router.use(authController.restrictTo("admin"));
router.get("/", userController.getUsers);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
