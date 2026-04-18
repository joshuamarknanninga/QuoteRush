const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

if (env.smtp.host && env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass }
  });
}

const sendEmail = async ({ to, subject, body }) => {
  if (transporter) {
    const result = await transporter.sendMail({
      from: env.smtp.from || env.smtp.user,
      to,
      subject,
      text: body
    });

    return {
      status: 'sent',
      providerId: result.messageId,
      info: `Email sent to ${to}`
    };
  }

  console.log(`[EMAIL SIMULATED] to=${to} subject=${subject} body=${body}`);
  return {
    status: 'simulated',
    providerId: `sim-email-${Date.now()}`,
    info: `Simulated email to ${to}`
  };
};

module.exports = { sendEmail };
