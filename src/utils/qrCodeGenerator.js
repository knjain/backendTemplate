const QRCode = require('qrcode');

async function generateQRCode(ticketId) {
  return QRCode.toDataURL(ticketId);
}

module.exports = {
  generateQRCode,
};
