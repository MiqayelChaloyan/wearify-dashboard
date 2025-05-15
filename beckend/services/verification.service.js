const crypto = require('crypto');

const verificationCodes = new Map();

function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function storeVerificationCode(email, code) {
  verificationCodes.set(email, {
    code,
    expiresAt: Date.now() + 300000
  });
}

function verifyCode(email, code) {
  const storedData = verificationCodes.get(email);
  
  if (!storedData || storedData.code != code) {
    return { valid: false, error: 'Invalid code' };
  }

  if (Date.now() > storedData.expiresAt) {
    verificationCodes.delete(email);
    return { valid: false, error: 'Code expired' };
  }

  return { valid: true };
}

function deleteVerificationCode(email) {
  verificationCodes.delete(email);
}

module.exports = {
  generateVerificationCode,
  storeVerificationCode,
  verifyCode,
  deleteVerificationCode,
  verificationCodes
};