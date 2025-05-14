import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const VerifyCode = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        code: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        code: '',
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

        if (!formData.code) {
            newErrors.code = "Verification code is required.";
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
                setError("");

                const res = await axios.post(
                    endpoints.verifyCode,
                    { email: formData.email, code: formData.code },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (res.status === 200) {
                    navigate(PAGES.NEW_PASSWORD, { state: { email: formData.email, code: formData.code } });
                } else {
                    setError("Invalid verification code.");
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.error || err.message || "Verification failed.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <Box className="verification-container">
            <Box className="verification-card">
                <Box className="header">
                    <Typography
                        variant="h5"
                        component="h2"
                        className="verification-subtitle"
                    >
                        Enter Verification Code
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
                    noValidate
                    autoComplete="off"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
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
                        name="code"
                        label="Verification Code *"
                        variant="outlined"
                        value={formData.code}
                        onChange={handleChange}
                        error={!!errors.code}
                        helperText={errors.code}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'SENDING...' : 'VERIFY'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default VerifyCode;
