import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from 'axios';

import { useDispatch } from "react-redux";
import { fetchStatistikaSuccess } from "../../../redux/features/statistikaSlice";


import { Alert, Box, Button, TextField, Typography } from "@mui/material";

import { PAGES } from "../../../constants/pages";
import { useAuth } from "../../../hooks/useAuth";
import { endpoints } from "../../../constants";

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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (validate()) {
      try {
        setLoading(true);
        setError('');

        const res = await axios.post(
          endpoints.login,
          {
            email: formData.email,
            password: formData.password
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );


        if (res.status === 200) {
          dispatch(fetchStatistikaSuccess(res.data.user.data));
          setIsAuthenticated(true);
          navigate(PAGES.MAIN);
        } else {
          setIsAuthenticated(false);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <Box className="login-container">
      <Box className="login-card">
        <Box className='header'>
          <Typography variant="h3" component="h1" className="login-title">Wearify</Typography>
          <Typography variant="h4" component="h2" className="login-subtitle">Log in</Typography>
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
          <Button variant="contained" type="submit" className="login-button">
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </Button>
        </Box>
        <Box className="login-links">
          <Link to={PAGES.RESET_PASSWORD}>Forgot password?</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
