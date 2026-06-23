import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

try {
  await transporter.verify();
  console.log("SMTP prêt.");
} catch (err) {
  console.error("Erreur SMTP :", err);
}

export default transporter;