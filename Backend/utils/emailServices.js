const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send contact notification to admin
exports.sendContactNotification = async ({ name, email, subject, message, messageId }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Message ID:</strong> ${messageId}</p>
      <hr>
      <p>Please log in to the admin panel to view and reply to this message.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent');
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};

// Send auto-reply to user
exports.sendAutoReply = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Thank you for contacting us',
    html: `
      <h2>Thank You for Contacting Us</h2>
      <p>Dear ${userName},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Our team typically responds within 24-48 hours.</p>
      <br>
      <p>Best regards,</p>
      <p>The School Administration Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Auto-reply email sent');
  } catch (error) {
    console.error('Error sending auto-reply:', error);
  }
};

// Send reply email to user
exports.sendReplyEmail = async (userEmail, userName, originalSubject, replyMessage) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Re: ${originalSubject}`,
    html: `
      <h2>Reply to Your Message</h2>
      <p>Dear ${userName},</p>
      <p>Thank you for contacting us. Here is our response to your inquiry:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3498db;">
        ${replyMessage}
      </div>
      <br>
      <p>If you have any further questions, please don't hesitate to contact us again.</p>
      <br>
      <p>Best regards,</p>
      <p>The School Administration Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reply email sent');
  } catch (error) {
    console.error('Error sending reply email:', error);
  }
};

module.exports = exports;