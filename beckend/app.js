const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const verificationRoutes = require('./routes/verification.routes');
const passwordResetRoutes = require('./routes/password.routes');
const tokenRoutes = require('./routes/token.routes');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/verification', verificationRoutes);
app.use('/password-reset', passwordResetRoutes);
app.use('/token', tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});