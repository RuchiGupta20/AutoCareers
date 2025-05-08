import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Stack, Paper
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Signup failed');
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
          Sign Up
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
          <Button variant="contained" onClick={handleSignup} fullWidth>
            Create Account
          </Button>
          <Typography
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer', textAlign: 'center', mt: 1 }}
          >
            Already have an account? Log In
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;
