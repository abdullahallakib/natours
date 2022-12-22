// review / rating / createAt /ref to tour / ref to user
const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewschema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review can not empty"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewschema.index({ tour: 1, user: 1 }, { unique: true });
// reviewschema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "-__v -passwordChangeAt",
//   });

//   next();
// });

reviewschema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: "tour",
  //     select: "name",
  //   }).populate({
  //     path: "user",
  //     select: "name photo",
  //   });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// reviewschema.statics.calcAverageRatings = async function (tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tour: tourId },
//     },
//     {
//       $group: {
//         _id: "$tour",
//         nRating: { $sum: 1 },
//         avgRating: { $avg: "$rating" },
//       },
//     },
//   ]);
//   console.log(stats);

//   await Tour.findByIdAndUpdate(tourId, {
//     ratingsQuantity: stats[0].nRating,
//     ratingsAverage: stats[0].avgRating,
//   });
// };

// reviewschema.post("save", function () {
//   this.constructor.calcAverageRatings(this.tour);
// });

// reviewschema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   console.log('this.r',this.r);
//   next();
// });

// reviewschema.post(/^findOneAnd/, async function (next) {
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

reviewschema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewschema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewschema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewschema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewschema);

module.exports = Review;
