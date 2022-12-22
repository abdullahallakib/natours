const express = require("express");
const { router } = require("../app");
const tourControl = require("./../controllers/toursControl");
const authcontroller = require("./../controllers/authControler");
const reviewControl = require("./../controllers/reviewControl");
const reviewRouter = require("./../routers/reviewRouter");

const Router = express.Router();

Router.route("/").get(tourControl.getalltours);
// Router
//   .route("/:tourId/reviews")
//   .post(
//     authcontroller.protect,
//     authcontroller.restrictTO("user"),
//     reviewControl.createReview
//   );

Router.use("/:tourId/reviews", reviewRouter);
Router.route("/tour-stats").get(tourControl.getTourStats);
Router.route("/monthly-plan/:year").get(
  authcontroller.protect,
  authcontroller.restrictTO("admin", "lead-guide", "guide"),
  tourControl.getMonthlyplan
);

Router.route("/top-5-cheap").get(
  tourControl.aliasTopTours,
  tourControl.getalltours
);
// Router.param('id', tourControl.chakeID);
Router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(
  tourControl.getToursWithin
);

// tours-within/233/center/-40,45/unit/mi
Router.route("/distances/:latlng/unit/:unit").get(tourControl.getDistance);
// .get(tourControl.getalltours)
Router.route("/").post(
  authcontroller.protect,
  authcontroller.restrictTO("admin", "lead-guide"),
  tourControl.createTour
);

Router.route("/:id")
  .get(tourControl.getTour)
  .patch(
    authcontroller.protect,
    authcontroller.restrictTO("admin", "lead-guide"),
    tourControl.uploadTourImages,
    tourControl.resizeTourImages,
    tourControl.updateTour
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictTO("admin", "lead-guide"),
    tourControl.deleteTour
  );

module.exports = Router;
// tourControl.updateTourImages,
// tourControl.resizeTourImages
