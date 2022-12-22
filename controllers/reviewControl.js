const Review = require("../models/reviewModel");
const APIFeature = require("../utilits/apiFeatures");
const AppError = require("../utilits/appError");
const catchAsync = require("../utilits/catchAsync");
const factory = require("./handlerFactor");

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.allReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.deletereview = factory.deleteOne(Review);
