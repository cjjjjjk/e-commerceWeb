const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Check if user exist and password is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // If everything is ok, log in
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err || "Internal error from server",
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Get token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to get access!",
      });
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token does no longer exist",
      });
    }

    // Check if user changed password after the token issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "fail",
        message: "You recently changed password! Please log in again!",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // role "admin"
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You don't have permission to perform this action",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with this email address!",
      });
    }

    // Create reset password token
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your password and
  passwordConfirm to ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid in 10 mins)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to user's email!",
      });
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "There was an error sending the email! Try again later!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    // If the token has not expired, and there is a user, set the new password
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Token is invalid or has expired!",
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log in and send JWT
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Get user
    const user = await User.findById(req.user.id).select("+password");

    // Check if posted password is correct
    if (!user.correctPassword(req.body.currentPassword, user.password)) {
      return res.status(400).json({
        status: "fail",
        message: "Your current password is incorrect!",
      });
    }

    // Update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in , send JWT
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
