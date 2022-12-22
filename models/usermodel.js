const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
// name email photo password ,passwordConfirm

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },

  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },

  photo: { type: String, default: "default.jpg" },

  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select: false,
  },

  passwordConfim: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not same!",
    },
  },
  passwordChangeAt: Date,
  PasswordRestToken: String,
  PasswordRestExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfim = undefined;
  next();
});

userschema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userschema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userschema.pre(/^find/, function (next) {
  this.find({ password: { $ne: false } });
  next();
});

userschema.methods.correctPassword = async function (
  candidatePassword,
  userpassword
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};

userschema.methods.changePasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangeAt) {
    const changedtimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    console.log(changedtimeStamp, jwtTimestamp);
    return jwtTimestamp < changedtimeStamp;
  }
  return false;
};

userschema.methods.correctPasswordRestToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.PasswordRestToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.PasswordRestToken);
  this.PasswordRestExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userschema);

module.exports = User;
