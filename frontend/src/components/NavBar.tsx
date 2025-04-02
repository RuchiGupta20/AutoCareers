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

// Example menu items for the side drawer
const navItems = ['Job Type', 'Experience Level', 'Salary Range', 'Location'];

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
      {/* Transparent, floating navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent', // Transparent background
          color: '#333',                  // Dark text/icons
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

          {/* Brand Icon (replace src with your logo) */}
          <Box
            component="img"
            src="/path/to/brand-icon.png"
            alt="Brand Icon"
            sx={{ width: 32, height: 32, mr: 1 }}
          />
        </Toolbar>
      </AppBar>

      {/* Side Drawer (opens from the left) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Example main content to illustrate the floating navbar effect */}
      <Box sx={{ mt: 8, p: 2 }}>
        
      </Box>
    </>
  );
};

export default NavBar;
