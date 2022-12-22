const express = require("express");
const reviewControl = require("./../controllers/reviewControl");
const authControler = require("./../controllers/authControler");

const Router = express.Router({ mergeParams: true });

Router.use(authControler.protect);

Router.route("/")
  .get(reviewControl.allReview)
  .post(
    authControler.restrictTO("user"),
    reviewControl.setTourUserIds,
    reviewControl.createReview
  );

Router.route("/:id")
  .get(reviewControl.getReview)
  .delete(authControler.restrictTO("user", "admin"), reviewControl.deletereview)
  .patch(authControler.restrictTO("user", "admin"), reviewControl.updateReview);

module.exports = Router;
