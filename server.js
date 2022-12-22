const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE_VS.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const Db_LOCAL = process.env.DATABASE_LOCAL;

const DBremoteid =
  "mongodb+srv://abdullah_akib:gMMvccgyrrE0GWrb@cluster0.fggx8gu.mongodb.net/Natours?retryWrites=true&w=majority";
const DATABASE_LOCAL = process.env.DATABASE_LOCAL;
// console.log("\x1b[31m%s\x1b[0m", "I am red");
// console.log("\x1b[34m%s\x1b[0m", "I am blue");
const mongocon = async () => {
  try {
    await mongoose.connect(DBremoteid);
    console.log("\x1b[34m%s\x1b[0m", "DB connection successfull!");
  } catch (err) {
    console.log(err.name, err.message);
    console.log("\x1b[34m%s\x1b[0m", "unhandledRejection *** shuting down....");
  }
};
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log("\x1b[34m%s\x1b[0m", `app running on ${port}.....`);
  await mongocon();
  // http://127.0.0.2:3000/
});

