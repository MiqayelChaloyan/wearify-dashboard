const express = require('express');
const router = express.Router();
const { ref, update, get } = require('firebase/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { database } = require('../config/firebase');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const clientRef = ref(database, 'clients');
    const snapshot = await get(clientRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'No clients found in database' });
    }

    const users = snapshot.val();
    const usersList = Object.values(users);

    const user = usersList.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Incorrect email or password'
      });
    }

    const isHashed = user.password.startsWith('$2a$') ||
      user.password.startsWith('$2b$') ||
      user.password.startsWith('$2y$');

    let passwordValid = false;

    if (isHashed) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      passwordValid = user.password === password;

      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await update(ref(database, `clients/${user.uid}`), {
          password: hashedPassword
        });
      }
    }

    if (!passwordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        details: 'Incorrect email or password'
      });
    }

    const userDataRef = ref(database, user.uid);
    const userSnapshot = await get(userDataRef);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'User profile data not found' });
    }

    const userData = userSnapshot.val();

    const payload = {
      uid: user.uid,
      email: user.email,
      role: 'user'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const clientId = Object.keys(users).find(id => users[id].email === email);

    if (!clientId) {
      return res.status(404).json({
        error: 'User not found',
        details: 'No account exists with this email address'
      });
    }

    await update(ref(database, `clients/${clientId}`), {
      token,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        uid: user.uid,
        email: user.email,
        data: { ...userData }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

module.exports = router;