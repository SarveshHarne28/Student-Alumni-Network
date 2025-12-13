const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS (use true if you switch to port 465)
  auth: {
    user: "95e3c9002@smtp-brevo.com",  // <- use this login, not your email
    pass: "dINHXUhCypma4Yf5",          // <- the key value
  },
});

async function testEmail() {
  try {
    let info = await transporter.sendMail({
      from: '"Alumni Network" <no-reply@yourdomain.com>', // can be your Brevo verified sender
      to: "hanijawad04@gmail.com",
      subject: "✅ Brevo SMTP Test",
      text: "If you receive this, SMTP works!",
    });
    console.log("✔️ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}

testEmail();
