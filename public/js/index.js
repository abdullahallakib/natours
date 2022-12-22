import "@babel/polyfill";
import { login, logout } from "./login";
import { displyMap } from "./mapbox";
import { bookTour } from "./stripe";
import { updatedDataSetting } from "./updateSetting";

const mapBox = document.getElementById("map");
const loginFrom = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav_el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displyMap(locations);
}

if (loginFrom) {
  loginFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log(form);
    // const name = document.getElementById("name").value;
    // const email = document.getElementById("email").value;

    updatedDataSetting(form, "data");
  });
}

// if (userPasswordForm) {
//   userPasswordForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     console.log("yes");
//     const currentPass = document.getElementById("password-current").value;
//     const newPass = document.getElementById("password").value;
//     const confirmPass = document.getElementById("password-confirm").value;

//     updatedDataSetting({ currentPass, newPass, confirmPass }, "password");
//   });
// }
// "passwordCurrent":"pass123456",
// "password":"pass1234567",
// "passwordConfim":"pass1234567"

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfim = document.getElementById("password-confirm").value;
    await updatedDataSetting(
      { passwordCurrent, password, passwordConfim },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "processing...";
    const { tourId } = e.target.dataset;
    console.log(tourId);
    bookTour(tourId);
  });
}
