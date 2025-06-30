import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../../store/actions/auth.action.jsx";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(form)).unwrap();
      setForm({
        name: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: "",
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            type="password"
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
}
