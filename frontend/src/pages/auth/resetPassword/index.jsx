import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Box, Button, TextField, Alert, Typography } from "@mui/material";

import { PAGES } from "../../../constants/pages";

import "./styles.css";
import { endpoints } from "../../../constants";
import axios from "axios";


const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors("Enter a valid email address.");
    } else {
      setErrors("");
      // console.log("Reset password link sent to:", email);
      // Add API call or confirmation UI here

      try {
        setLoading(true);
        setError('');

        const res = await axios.post(
          endpoints.ressetPassword,
          { email },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );


        if (res.status === 200) {
          // dispatch(fetchStatistikaSuccess(res.data.user.data));
          // setIsAuthenticated(true);
          navigate(PAGES.VERIFY_CODE, { state: { email } });
        } else {
          // setIsAuthenticated(false);
          setError('Failed to send verification code');
        }

      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to send verification code';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box className="reset-password-container">
      <Box className="reset-password-card">
        <Box className="header">
          <Typography variant="h4" component="h2" className="reset-password-subtitle">Enter your email to reset password</Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
            error={!!errors}
            helperText={errors}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            {loading ? 'SENDING...' : ' RESET PASSWORD'}
          </Button>
        </Box>
        <Box className="reset-password-links">
          <Link to={PAGES.SIGN_IN}>Cancel</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
