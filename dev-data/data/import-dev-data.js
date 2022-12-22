// const fs = require("fs");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Tour = require("../../models/tourModel");
// const User = require("../../models/usermodel");
// const Review = require("../../models/reviewModel");

// dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_APLI
// );
// const Db_LOCAL = process.env.DATABASE_LOCAL;
// const DBremoteid =
//   "mongodb+srv://abdullah_akib:gMMvccgyrrE0GWrb@cluster0.fggx8gu.mongodb.net/Natours?retryWrites=true&w=majority";
// //;process.env.DATABASE_LOCAL
// // console.log(DB)
// mongoose.connect(DBremoteid).then((CON) => {
//   // console.log(CON.connections);
//   console.log("DB connection successfull!");
// });

// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/tours-simple.json`, "utf8")
// // );

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf8"));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, "utf8")
// );

// //??import data into db
// const importData = async () => {
//   try {
//     await Tour.create(tours, { validateBeforeSave: false });
//     await User.create(users, { validateBeforeSave: false });
//     await Review.create(reviews);

//     console.log("data successfull lodded");
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// //delete al data form
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     await User.deleteMany();
//     await Review.deleteMany();
//     console.log("data successfull delete");
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// if (process.argv[2] === "--import") {
//   importData();
// } else if (process.argv[2] === "--delete") {
//   deleteData();
// }
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/usermodel");

dotenv.config({ path: "./config.env" });

const DB =
  "mongodb+srv://abdullah_akib:gMMvccgyrrE0GWrb@cluster0.fggx8gu.mongodb.net/Natours?retryWrites=true&w=majority";

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log("DB connection successful!"));

const DBremoteid =
  "mongodb+srv://abdullah_akib:gMMvccgyrrE0GWrb@cluster0.fggx8gu.mongodb.net/Natours?retryWrites=true&w=majority";
//;process.env.DATABASE_LOCAL
// console.log(DB)
mongoose.connect(DBremoteid).then((CON) => {
  // console.log(CON.connections);
  console.log("DB connection successfull!");
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
