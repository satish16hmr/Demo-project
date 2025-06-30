import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/reset-password`,
        { token, password },
        { withCredentials: true }
      );
      setSuccess(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <Container maxWidth="xs" sx={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
          <Alert severity="error">Invalid or missing token.</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
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
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}