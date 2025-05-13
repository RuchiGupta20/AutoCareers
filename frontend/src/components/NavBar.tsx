import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Types for props
interface NavBarProps {
  viewMode: 'applicant' | 'recruiter';
  onSwitchProfile: (mode: 'applicant' | 'recruiter') => void;
}

// Updated menu items for the side drawer
const navItems = ['Job Board', 'Resume Review', 'Message Board', 'Log out'];

const NavBar: React.FC<NavBarProps> = ({ viewMode, onSwitchProfile }) => {
  // State to manage whether the drawer is open
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Toggles the drawer open/close
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle profile switch
  const handleProfileSwitch = (mode: 'applicant' | 'recruiter') => {
    onSwitchProfile(mode);
    setDrawerOpen(false);
  };

  // Content displayed inside the side drawer
  const drawerContent = (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}
      role="presentation"
    >
      {/* Regular menu items */}
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={handleDrawerToggle}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Spacer to push profile switcher to bottom */}
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      {/* Profile switching section - explicitly show both profiles */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Switch Profile
        </Typography>
        <List disablePadding>
          <ListItem disablePadding sx={{ display: 'block', mb: 1 }}>
            <ListItemButton 
              selected={viewMode === 'applicant'}
              onClick={() => handleProfileSwitch('applicant')}
              sx={{ borderRadius: 1 }}
            >
              <Avatar 
                sx={{ mr: 2, width: 32, height: 32 }} 
                src="https://randomuser.me/api/portraits/men/77.jpg"
              />
              <ListItemText primary="Applicant Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={viewMode === 'recruiter'}
              onClick={() => handleProfileSwitch('recruiter')}
              sx={{ borderRadius: 1 }}
            >
              <Avatar 
                sx={{ mr: 2, width: 32, height: 32 }} 
                src="https://randomuser.me/api/portraits/men/42.jpg"
              />
              <ListItemText primary="Recruiter Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Solid navbar with fixed position */}
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          backgroundColor: '#fff', 
          color: '#333',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          {/* Hamburger menu icon */}
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'inherit' }}
          >
            <MenuIcon />
          </IconButton>

          {/* AutoCareers Logo */}
          <Box
            component="img"
            src="/autocareer_logo.png"
            alt="AutoCareers Logo"
            sx={{ height: 36, mr: 2 }}
          />
          
          {/* Message Board Title */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            {viewMode === 'applicant' ? 'Applicant Message Board' : 'Recruiter Message Board'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer (opens from the left) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250 
          },
        }}
        ModalProps={{
          keepMounted: true // Better performance on mobile
        }}
      >
        <Toolbar /> {/* This creates space for the app bar */}
        {drawerContent}
      </Drawer>

      {/* Extra toolbar to push content below the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavBar;
