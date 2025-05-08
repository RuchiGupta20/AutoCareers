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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Updated menu items for the side drawer
const navItems = ['Job Board', 'Resume Review', 'Message Board', 'Log out'];

const NavBar: React.FC = () => {
  // State to manage whether the drawer is open
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Toggles the drawer open/close
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Content displayed inside the side drawer
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
            Message Board
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer (opens from the left) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, marginTop: '64px' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Extra toolbar to push content below the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavBar;
