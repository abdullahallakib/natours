const express = require("express");
const bookingController = require("./../controllers/bookingsControler");
const authControler = require("./../controllers/authControler");
const { route } = require("./reviewRouter");
const router = express.Router();

router.use(authControler.protect);
router.get("/checkout-session/:tourId", bookingController.getCheckoutSession);
router.use(authControler.restrictTO("admin", "lead-guides"));

router
  .route("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createoneBooking);

router
  .route("/:id")
  .get(bookingController.getOneBooking)
  .patch(bookingController.updateOneBooking)
  .delete(bookingController.deleteOneBooking);

module.exports = router;
