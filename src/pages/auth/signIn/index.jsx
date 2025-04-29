import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Box, Button, TextField } from "@mui/material";

import { PAGES } from "../../../constants/pages";
import { useAuth } from "../../../hooks/useAuth";

import "./styles.css";


const SignIn = () => {
  const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simulate login
      setIsAuthenticated(true)
      navigate(PAGES.MAIN)
      console.log("Logging in with:", formData);
      // You can redirect or call an API here
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Wearify</h2>
        <h3 className="login-subtitle">Log in</h3>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            name="email"
            label="Email Address *"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            name="password"
            label="Password *"
            type="password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button variant="contained" type="submit" className="login-button">LOG IN</Button>
        </Box>
        <div className="login-links">
          <Link to={PAGES.RESET_PASSWORD}>Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
