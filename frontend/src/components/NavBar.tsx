// import React from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Drawer,
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

// interface NavbarProps {
//   // Define any props you might need, or leave empty if none.
// }

// const Navbar: React.FC<NavbarProps> = () => {
//   // State to control whether the drawer (sidebar menu) is open
//   const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

//   // Toggles the drawer open/close
//   const handleDrawerToggle = () => {
//     setIsDrawerOpen((prevState) => !prevState);
//   };

//   // A simple array of menu items (you can replace with your own links)
//   const menuItems = ['Home', 'About', 'Services', 'Contact'];

//   return (
//     <>
//       {/* Top AppBar */}
//       <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
//   <Toolbar>
//     {/* Your navbar content here */}
//     <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
//       <MenuIcon />
//     </IconButton>
//     <Typography variant="h6" sx={{ flexGrow: 1 }}>
//       MyWebsite
//     </Typography>
//   </Toolbar>
// </AppBar>

//       {/* Drawer (Side Menu) */}
//       <Drawer
//         anchor="left"
//         open={isDrawerOpen}
//         onClose={handleDrawerToggle}
//       >
//         <Box
//           sx={{ width: 250 }}
//           role="presentation"
//           onClick={handleDrawerToggle}
//           onKeyDown={handleDrawerToggle}
//         >
//           <List>
//             {menuItems.map((text, index) => (
//               <ListItem key={index} disablePadding>
//                 <ListItemButton>
//                   <ListItemText primary={text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;

import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// Example menu items
const navItems = ['Job Type', 'Experience Level', 'Salary Range', 'Location'];

const NavBar: React.FC = () => {
  // Drawer open/close state
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Toggle the mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Check screen size for responsive design
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  // Drawer content
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
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#fff',        // White background
          borderBottom: '1px solid #e0e0e0', // Subtle bottom border
          color: '#333',                  // Dark text/icons
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          {/* Hamburger icon ALWAYS visible on all screen sizes */}
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, color: 'inherit' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand/Logo */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 'bold',
              mr: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            MyBrand
          </Typography>

          {/* Push center items to the right on large screens */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Nav items (visible on md+ screens) */}
          {isMediumUp && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: 'inherit',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          {/* Push search icon to the far right */}
          {isMediumUp && <Box sx={{ flexGrow: 1 }} />}

          {/* Search icon */}
          <IconButton sx={{ color: 'inherit' }}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer that slides in from the left */}
      <Drawer
        anchor="left"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Improves mobile performance
        }}
        sx={{
          // Only show Drawer on smaller screens by default
          // but it will still function if opened on any screen
          display: { xs: 'block', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavBar;
