import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Stack, Paper
} from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      alert('Google sign-in failed');
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" mb={2} textAlign="center" fontWeight={600}>
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleLogin} fullWidth>
            Login
          </Button>
          <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
            Sign in with Google
          </Button>
          <Typography
            variant="body2"
            onClick={() => navigate('/signup')}
            sx={{ cursor: 'pointer', textAlign: 'center', mt: 1 }}
          >
            Don’t have an account? Sign Up
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
