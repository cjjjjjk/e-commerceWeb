const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
  console.log("hello");
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal error from server" });
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not defined!",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not defined!",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not defined!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not defined!",
  });
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

    res.json({ code: "success", user });
  } catch (error) {
    console.error("Google Sign-In err: ", error);
    res.status(500).json({ message: "Server Err!" });
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
