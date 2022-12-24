import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51MHUckHMhKGG4I9MFxX61qjC2ewRKuJfFdjTh8b1VUbccAKzfEHqEauxmIId3RZknbRRqEesvFsJIuMHrt3Y4EBe00WkwRzf0E"
);

// export const bookTour = async (tourid) => {
//   const session = await axios(
//     `http://127.0.0.2:3000/api/v1/booking/checkout-session/${tourid}`
//   );
//   console.log(session);
// };

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.2:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
