const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const AppError = require("../utilits/appError");
const Email = require("../utilits/email");
const Sendgrid = require("../utilits/sendgrid");

const crypto = require("crypto");
const catchAsync = require("../utilits/catchAsync");

const singtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, STATUS_CODES, res) => {
  const token = singtoken(user._id);

  const cookieoptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieoptions.secure = true;

  res.cookie("jwt", token, cookieoptions);
  res.status(STATUS_CODES).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();
  
  // Sendgrid.mail();
  createSendToken(newUser, 201, res);

});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 sheck  if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  // 2 check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email and password ", 401));
  }

  // 3 if everthing ok , send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
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
    return next(
      new AppError("you are  not logged in! please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUserr = await User.findById(decoded.id);
  if (!currentUserr) {
    return next(
      new AppError("The user belonging to this user does no longer exsit ", 401)
    );
  }

  if (currentUserr.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password ! please log in again", 401)
    );
  }

  req.user = currentUserr;
  res.locals.user = currentUserr;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUserr = await User.findById(decoded.id);
      if (!currentUserr) {
        return next();
      }

      if (currentUserr.changePasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUserr;
      return next();
    }
  } catch (error) {
    return next();
  }

  next();
};

exports.restrictTO = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permisson to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = user.correctPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.PasswordRestToken = undefined;
    user.PasswordRestExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email ,try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    PasswordRestToken: hashedToken,
    PasswordRestExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfim = req.body.passwordConfim;
  user.PasswordRestToken = undefined;
  user.PasswordRestExpires = undefined;

  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is worng ", 401));
  }

  user.password = req.body.password;
  user.passwordConfim = req.body.passwordConfim;
  await user.save();

  createSendToken(user, 201, res);
});
