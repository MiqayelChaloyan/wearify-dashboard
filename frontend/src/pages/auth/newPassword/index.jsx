import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Alert,
  Typography,
} from "@mui/material";

import { endpoints } from "../../../constants";
import { PAGES } from "../../../constants/pages";

import "./styles.css";
import axios from "axios";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, code } = location.state || {};

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email || !code) {
    return (
      <Box className="new-password-container">
        <Typography variant="h6">Missing verification data. Please restart the password reset process.</Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      password: '',
      confirmPassword: ''
    };

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (validate()) {
      try {
        setLoading(true);
        setError('');

        const res = await axios.post(
          endpoints.setNewPassword,
          {
            email,
            code,
            newPassword: formData.password,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (res.status === 200) {
          navigate(PAGES.SIGN_IN);
        } else {
          setError("Failed to reset password. Please try again.");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || "Failed to reset password.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box className="new-password-container">
      <Box className="new-password-card">
        <Box className="header">
          <Typography variant="h5" component="h2" className="new-password-subtitle">
            Set New Password
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            name="password"
            label="New Password *"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password *"
            type="password"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? 'SAVING...' : 'SET NEW PASSWORD'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NewPassword;
