import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "7516bb001@smtp-brevo.com",
    pass: "Y47HMxNK5DVT38gB",
  },
});

export default transporter;
