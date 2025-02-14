const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

sgMail.setApiKey(config.sendGridAPIKey);

async function sendEmail(to, subject, body) {
  const msg = {
    to,
    from: config.adminEmail,
    subject,
    text: body,
  };

  return sgMail.send(msg);
}

module.exports = {
  sendEmail,
};
