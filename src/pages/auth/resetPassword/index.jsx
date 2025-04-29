import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Box, Button, TextField } from "@mui/material";

import { PAGES } from "../../../constants/pages";

import "./styles.css";


const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
    } else {
      setError("");
      console.log("Reset password link sent to:", email);
      // Add API call or confirmation UI here
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h3 className="reset-password-subtitle">Enter your email to reset password</h3>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <TextField
            name="email"
            label="Email Address *"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth className="reset-password-button">
            RESET PASSWORD
          </Button>
        </Box>
        <div className="reset-password-links">
          <Link to={PAGES.SIGN_IN}>Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
