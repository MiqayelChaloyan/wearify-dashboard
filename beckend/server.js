const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getDatabase, ref, update, get } = require('firebase/database');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);


// Middleware
app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// Login Route
app.post('/login', async (req, res) => {
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

    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, etc.)
    const isHashed = user.password.startsWith('$2a$') ||
      user.password.startsWith('$2b$') ||
      user.password.startsWith('$2y$');

    let passwordValid = false;

    if (isHashed) {
      // Compare with bcrypt for hashed passwords
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      // Fallback to plaintext comparison for legacy passwords
      passwordValid = user.password === password;

      // If plaintext matches, upgrade to hashed password
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

    // Get additional user data
    const userDataRef = ref(database, user.uid);
    const userSnapshot = await get(userDataRef);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: 'User profile data not found' });
    }

    const userData = userSnapshot.val();

    res.status(200).json({
      message: 'Login successful',
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



// Reset code
// Generate a random 6-digit code
function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

const verificationCodes = new Map();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email) {
  const code = generateVerificationCode();

  // Store code with email and expiration (5 minutes)
  verificationCodes.set(email, {
    code,
    expiresAt: Date.now() + 300000
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification code sent' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send verification code' };
  }
}

// Example Express route
app.post('/send-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = await sendVerificationEmail(email);

  res.json(result);
});


// Verification check endpoint
app.post('/verify-code', (req, res) => {
  const { email, code } = req.body;

  const storedData = verificationCodes.get(email);

  if (!storedData || storedData.code != code) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  if (Date.now() > storedData.expiresAt) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: 'Code expired' });
  }

  // Code is valid - clear it and proceed
  // verificationCodes.delete(email);
  console.log(code, email, 'Verification successful')

  res.json({ success: true, message: 'Verification successful' });
});


app.post('/set-new-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  // Input validation
  if (!email || !code || !newPassword) {
    return res.status(400).json({
      error: 'All fields are required',
      details: 'Please provide email, verification code, and new password'
    });
  }

  // Validate password strength
  if (newPassword.length < 6) {
    return res.status(400).json({
      error: 'Weak password',
      details: 'Password must be at least 8 characters long'
    });
  }

  try {
    // Debug logging
    console.log('Verification codes map:', verificationCodes);
    console.log('Looking for email:', email);

    // Verify the code
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(400).json({
        error: 'Invalid verification code',
        details: 'No verification code found for this email. Please request a new code.'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        error: 'Invalid verification code',
        details: 'The code you entered does not match the one we sent'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({
        error: 'Code expired',
        details: 'The verification code has expired. Please request a new one.'
      });
    }

    // Find user in database
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

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await update(ref(database, `clients/${clientId}`), {
      password: hashedPassword,
      lastPasswordUpdate: new Date().toISOString() // Track when password was changed
    });

    // Clean up verification code
    verificationCodes.delete(email);

    // Log successful password change
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});