const express = require("express");
const userscontrol = require("./../controllers/usersControl");
const authControler = require("./../controllers/authControler");

const Router = express.Router();

//

Router.post("/signup", authControler.signup);
Router.post("/login", authControler.login);
Router.get("/logout", authControler.logout);
Router.post("/forgotPassword", authControler.forgotPassword);
Router.patch("/resetPassword/:token", authControler.resetPassword);

// protect  all route after this middleware
Router.use(authControler.protect);

Router.patch("/updatemyPassword", authControler.updatePassword);
Router.patch(
  "/updateme",
  userscontrol.uploadUserPhoto,
  userscontrol.resizeUserPhoto,
  userscontrol.updatMe
);
Router.delete("/deleteme", userscontrol.deleteMe);
Router.route("/me").get(userscontrol.getMe, userscontrol.getusers);

Router.use(authControler.restrictTO("admin"));

Router.route("/").get(userscontrol.getallusers).post(userscontrol.createusers);

Router.route("/:id")
  .get(userscontrol.getusers)
  //// bag find do not use password
  .patch(userscontrol.updateusers)
  .delete(userscontrol.deleteusers);

module.exports = Router;
