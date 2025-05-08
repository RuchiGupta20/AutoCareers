// src/pages/Dashboard.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Welcome!</Typography>
      <Button onClick={logout} sx={{ mt: 2 }} variant="outlined">Logout</Button>
    </Box>
  );
};

export default Dashboard;
