const Review = require("./../models/reviewModel");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const product = req.body.product;
    const reviews = await Review.find({ product }).populate({
      path: "user",
      select: "displayName photoUrl",
    });

    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.product) req.body.product = req.params.productId;
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newReview,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(400).json({
        status: "fail",
        message: "The tour with this ID doesn't exist!",
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(400).json({
        status: "fail",
        message: "The tour with this ID doesn't exist!",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
