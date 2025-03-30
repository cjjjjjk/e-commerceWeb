const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.googleSignIn = async (req, res) => {
  try {
    const { uid, email, displayName, photoUrl, emailVerified } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Props Missing ?" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        authProvider: "google",
        uid,
        email,
        emailVerified,
        displayName,
        photoUrl,
        role: "user",
      });

      await user.save();
    }

    res.json({code: 'success', user });

  } catch (error) {
    console.error("Google Sign-In err: ", error);
    res.status(500).json({ message: "Server Err!" });
  }
};
