const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'magdalen.johns40@ethereal.email',
//         pass: 'EgBYygy6c5XTJhESNh'
//     }
// });

var transporter = nodemailer.createTransport({
  host: '.ru',
  port: 465,
  secure: true,
  auth: {
    user: '@mail.ru',
    pass: ''
  }
});

const mailOptions = {
  from: '.ru',
  to: '@mail.ru',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
