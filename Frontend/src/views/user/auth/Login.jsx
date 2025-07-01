import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../store/actions/auth.action.jsx';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      setForm({ email: '', password: '' });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
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
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
       <Typography align="center" sx={{ mt: 2 }}>
            <Link to="/forgot-password">Forgot Password?</Link>
        </Typography>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
}