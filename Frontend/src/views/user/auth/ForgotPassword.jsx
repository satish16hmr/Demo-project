import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/forgot-password`,
        { email },
        { withCredentials: true }
      );
      setSuccess(res.data.message || "If that email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            fullWidth
            margin="normal"
            required
          />
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}