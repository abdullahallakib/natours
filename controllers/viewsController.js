const { path } = require("../app");
const Tour = require("../models/tourModel");
const User = require("../models/usermodel");
const Booking = require("../models/bookingModel");

const AppError = require("../utilits/appError");
const catchAsync = require("../utilits/catchAsync");

exports.getoverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginFrom = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Log into you",
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({ user: req.user.id });
  const tourids = booking.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourids } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});
