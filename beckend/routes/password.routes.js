const express = require('express');
const router = express.Router();
const { ref, update, get } = require('firebase/database');
const bcrypt = require('bcryptjs');
const { verifyCode, deleteVerificationCode, verificationCodes } = require('../services/verification.service');
const { database } = require('../config/firebase');

router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;

  const result = verifyCode(email, code);

  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, message: 'Verification successful' });
});

router.post('/set-new-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      error: 'All fields are required',
      details: 'Please provide email, verification code, and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: 'Weak password',
      details: 'Password must be at least 8 characters long'
    });
  }

  try {
    console.log('Verification codes map:', verificationCodes);
    console.log('Looking for email:', email);

    const result = verifyCode(email, code);
    if (!result.valid) {
      return res.status(400).json({
        error: result.error,
        details: result.error === 'Invalid code' ? 
          'The code you entered does not match the one we sent' : 
          'The verification code has expired. Please request a new one.'
      });
    }

    const clientsRef = ref(database, 'clients');
    const snapshot = await get(clientsRef);

    if (!snapshot.exists()) {
      return res.status(404).json({
        error: 'No users found',
        details: 'The clients database is empty'
      });
    }

    const clients = snapshot.val();
    const clientId = Object.keys(clients).find(id => clients[id].email === email);

    if (!clientId) {
      return res.status(404).json({
        error: 'User not found',
        details: 'No account exists with this email address'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await update(ref(database, `clients/${clientId}`), {
      password: hashedPassword,
      lastPasswordUpdate: new Date().toISOString()
    });

    deleteVerificationCode(email);

    console.log(`Password updated successfully for user: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
      details: 'You can now login with your new password'
    });

  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
    });
  }
});

module.exports = router;