const express = require('express');
const router = express.Router();
const { ref, get } = require('firebase/database');
const { verifyToken } = require('../middlewares/auth.middleware');
const { database } = require('../config/firebase');

router.get('/verify-token', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const userDataRef = ref(database, uid);
    const userSnapshot = await get(userDataRef);

    const userData = userSnapshot.val();

    if (!userSnapshot.exists()) {
      return res.status(404).json({
        error: 'User not found',
        details: `No data at path: ${uid}`
      });
    }

    res.status(200).json({
      user: {
        uid,
        email,
        data: { ...userData }
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;