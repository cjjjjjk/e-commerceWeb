const express = require("express");
const passport = require("passport");

const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleLogin
);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.post("/refresh-token", authController.refreshToken);

router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser); 
router.patch("/updateMe", userController.updateMe);
router.patch("/updateMyPassword", authController.updatePassword);

router.use(authController.restrictTo("admin"));
router.get("/", userController.getUsers);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
