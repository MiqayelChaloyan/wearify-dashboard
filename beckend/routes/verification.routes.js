const express = require('express');
const router = express.Router();
const { generateVerificationCode, storeVerificationCode } = require('../services/verification.service');
const { sendVerificationEmail } = require('../services/email.service');

router.post('/send-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const code = generateVerificationCode();
  storeVerificationCode(email, code);
  const result = await sendVerificationEmail(email, code);

  res.json(result);
});

module.exports = router;