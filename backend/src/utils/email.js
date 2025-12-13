// backend/src/utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "95e3c9002@smtp-brevo.com",  // Brevo SMTP login
    pass: "dINHXUhCypma4Yf5",          // Brevo SMTP key
  },
});

async function sendEmail(to, subject, text, html = "") {
  try {
    const info = await transporter.sendMail({
      from: '"Alumni Network" <hanijawwad999@gmail.com>', // must be verified sender
      to,
      subject,
      text,
      html,
    });
    console.log("✔️ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
}

module.exports = sendEmail;
