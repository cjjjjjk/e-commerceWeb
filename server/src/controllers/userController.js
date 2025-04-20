const User = require("../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(404).json({
        status: "fail",
        message:
          "This route is not for password update. Please use /updateMyPassword",
      });
    }

    const filteredBody = filterObj(req.body, "displayName", "email");
    console.log(filteredBody);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
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

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "The user belong to this ID doesn't exist!",
      });
    }
    res.status(204).json({
      status: "fail",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};