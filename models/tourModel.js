const mongoose = require("mongoose");
const { promises } = require("nodemailer/lib/xoauth2");
const slugify = require("slugify");
// const User = require("./usermodel");

const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [
        40,
        "A tour name must have length less or equal then 40 characters",
      ],
      minlength: [
        10,
        "A tour name must have length more or equal then 10 characters",
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "a tour must have group size"],
    },
    difficulty: {
      type: String,
      required: [true, ["A tour must have a difficulty"]],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficalty is either :easy ,medium, difficalty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      // unique: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discout price ({VAlUE} should be below regular price)",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "a tour must have a cove image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourschema.index({ price: 1, ratingsAverage: -1 });
tourschema.index({ slug: 1 });
tourschema.index({ startLocation: "2dsphere" });

tourschema.virtual("durationweeks").get(function () {
  return this.duration / 7;
});

tourschema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourschema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangeAt",
  });

  next();
});

// tourschema.pre("save", async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromise);

//   next();
// });

// tourschema.pre("save", function (next) {
//   console.log('will save docmonent.....');
//   next();
// });

// tourschema.post("save", function (doc,next) {
//   console.log(doc);
//   next();
// });

// tourschema.pre("find", function (next) {
tourschema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourschema.post(/^find/, function (doc, next) {
  console.log(`query took ${Date.now() - this.start}milliseconds!`);
  // console.log(doc);
  next();
});

// tourschema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });
const Tour = mongoose.model("Tour", tourschema);

module.exports = Tour;
