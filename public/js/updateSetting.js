import axios from "axios";
import { showAlert } from "./alerts";

export const updatedDataSetting = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.2:3000/api/v1/users/updatemyPassword"
        : "http://127.0.0.2:3000/api/v1/users/updateme";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully`);
      window.setTimeout(() => {
        location.assign("http://127.0.0.2:3000/me");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
