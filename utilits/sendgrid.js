const sgmail = require("@sendgrid/mail");
const { response } = require("../app");
const API_KEY =
  "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";

sgmail.setApiKey(API_KEY);

const message = {
  to: "abdullahallakib79@gmail.com",
  from: "abdullahakib313@gmail.com",
  subject: "hello from Sendgrid",
  Text: "hello from SendGrid",
  html: "<h1> hello from Sendgrid</h2>",
};

exports.mail = () => {
  sgmail
    .send(message)
    .then((respose) => console.log("email send..."))
    .catch((error) => console.log(error.message));
};
