const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("./../models/userModel");
const Cart = require("./../models/cartModel");
const Email = require("./../utils/email");
const crypto = require("crypto");
const USER_URL = process.env.FRONTEND_URL;

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.cookie("refresh_token", refreshToken, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const { password, ...userData } = user;

  // const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  // const authClient = `${clientUrl}/auth?token=${token}`;
  // res.redirect(authClient);
  res.status(statusCode).json({
    status: "success",
    token,
    refreshToken,
    data: {
      ...userData,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const avatars = [
      "https://i.imgur.com/VAhQIqV.png",
      "https://i.imgur.com/btiIFHP.png",
      "https://i.imgur.com/aJKfWLf.png",
      "https://i.imgur.com/padyuTG.png",
      "https://i.imgur.com/Sb3bqmw.png",
      "https://i.imgur.com/Aoja6dx.png",
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      photoUrl: randomAvatar,
    });
    // console.log(newUser);

    const cart = await Cart.create({
      userId: newUser._id,
      items: [],
    });

    await cart.save();

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
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
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

    try {
      const resetURL = `${USER_URL}/resetPassword/${resetToken}`;

      await new Email(user, resetURL).sendPasswordReset();

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

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.googleLogin = (req, res) => {
  const user = req.user;
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  res.cookie("refresh_token", refreshToken, cookieOptions);

  user.refreshToken = refreshToken;
  user.save();

  user.password = undefined;

  // const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  // const authClient = `${clientUrl}/auth?token=${token}`;
  // res.redirect(authClient);
  // if (user.role == "user")
  //   return res.redirect(`${process.env.FRONTEND_URL}/member`);
  // else return res.redirect(`${process.env.FRONTEND_URL}/admin`);
  return res.redirect(`${process.env.FRONTEND_URL}/auth?token=${token}`);
};

// refresh Token:
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({
      status: "fail",
      message: "Refresh token not found. Please log in again.",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "User not found. Please log in again.",
      });
    }

    const newAccessToken = jwt.sign(
      { id: currentUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: "success",
      token: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "fail",
      message: "Invalid refresh token. Please log in again.",
    });
  }
};
