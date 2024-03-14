const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  // 2) Define the email options
  const mailOptions = {
    from: {
      name: 'DevLinks Team',
      address: process.env.EMAIL_USERNAME,
    },
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
