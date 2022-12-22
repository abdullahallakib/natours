const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/usermodel");
const AppError = require("../utilits/appError");
const catchAsync = require("../utilits/catchAsync");
const factory = require("./handlerFactor");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("NOt an image ! please upload only image "));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newobj[el] = obj[el];
  });
  return newobj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updatMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update.please use /updatemyPassword",
        400
      )
    );
  }

  const filterbody = filterObj(req.body, "name", "email");
  if (req.file) filterbody.photo = req.file.filename;

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterbody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createusers = (req, res) => {
  res.status(500).json({
    Satatus: "error",
    message: "this route is not defined! please use /signup instead",
  });
};

exports.getallusers = factory.getAll(User);
exports.getusers = factory.getOne(User);
exports.updateusers = factory.updateOne(User);
exports.deleteusers = factory.deleteOne(User);

//
