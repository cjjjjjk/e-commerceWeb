const express = require("express");
const { getUsers, googleSignIn } = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.post("/google-signin", googleSignIn);

module.exports = router;
