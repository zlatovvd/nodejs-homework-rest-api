const nodemailer = require("nodemailer");

const sendEmail = (email) => {
  const { MAIL_USER, MAIL_PASSWORD, MAIL_SMTP, MAIL_PORT, MAIL_SECURE } =
    process.env;

  const nodemailerConfig = {
    host: MAIL_SMTP,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  };

  const transport = nodemailer.createTransport(nodemailerConfig);

  transport
    .sendMail(email)
    .then(() => console.log("Success"))
    .catch((error) => console.log(error.message));
};

module.exports = sendEmail;
