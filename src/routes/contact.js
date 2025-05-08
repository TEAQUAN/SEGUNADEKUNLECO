const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/contact', async (req, res) => {
    console.log('Contact route hit')
    const { user_name: name, user_email: email, user_phone: phone, subject, message } = req.body;
  console.log('Request body:', req.body)
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER, // Your own Gmail address
        subject: `New Contact Form Submission: ${subject}`, // Improved subject
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
                    h3 { color: #007bff; margin-top: 0; }
                    p { margin-bottom: 10px; }
                    strong { font-weight: bold; }
                    .message-box { padding: 15px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff; white-space: pre-wrap; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div class="message-box">${message}</div>
                </div>
            </body>
            </html>
        `,
    };
    console.log('Sending email')
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Error sending email: ' + error.message });
  }
});

module.exports = router;
