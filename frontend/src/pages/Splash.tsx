import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Welcome to AutoCareers!
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Launch your career journey today
      </Typography>
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          backgroundColor: '#fff',
          color: '#007aff',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          borderRadius: 8,
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Splash;
