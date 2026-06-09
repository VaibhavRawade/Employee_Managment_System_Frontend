import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import useAuth from '../hooks/useAuth';
import { clearSession } from '../services/authService';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { authenticated: isLoggedIn } = useAuth();
const [openLogin, setOpenLogin] = useState(false);
const [anchorEl, setAnchorEl] = useState(null);



  // Check if screen width is below 1000px
  const isMobile = useMediaQuery('(max-width:1000px)');
  console.log("isLoggedIn =", isLoggedIn);
 console.log("currentPath =", currentPath);


 const roleName = sessionStorage.getItem("roleName");
const isEmployeeLog = roleName === "ROLE_EMPLOYEE";

const hideMenu =
  currentPath === '/login' ||
  currentPath === '/employee-login' ||
  currentPath === '/dashboard' ||
  currentPath === '/employees' ||
  currentPath === '/departments' ||
  currentPath === '/profile' ||
    currentPath === '/' ||
  currentPath === '/reset-password' ||
    currentPath === '/verify-username' ||
  currentPath === '/add-department' ||
  currentPath === '/add-employee' ||
  currentPath === '/employee-profile' ||
  currentPath.startsWith('/edit-employee/') ||
  currentPath.startsWith('/edit-department/');

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    clearSession();
    sessionStorage.clear();
    navigate('/login');
  };


const handleLoginClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#3f51b5', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')} onClick={handleDrawerToggle}>
          <ListItemText primary="Home" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={handleDrawerToggle}>
          <ListItemText primary="Dashboard" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/employees" selected={isActive('/employees')} onClick={handleDrawerToggle}>
          <ListItemText primary="Employees" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/departments" selected={isActive('/departments')} onClick={handleDrawerToggle}>
          <ListItemText primary="Departments" sx={{ color: isActive('/departments') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/profile" selected={isActive('/profile')} onClick={handleDrawerToggle}>
          <ListItemText primary="Profile" sx={{ color: isActive('/profile') ? '#ff9800' : 'white' }} />
        </ListItem>

<ListItem button onClick={() => setOpenLogin(!openLogin)}>
  <ListItemText
    primary={isLoggedIn ? 'Logout' : 'Login'}
    sx={{
      color: isLoggedIn
        ? 'red'
        : isActive('/login')
        ? '#ff9800'
        : 'white',
    }}
    onClick={isLoggedIn ? handleLogout : null}
  />
</ListItem>

{!isLoggedIn && openLogin && (
  <>
    <ListItem
      button
      component={Link}
      to="/admin-login"
      onClick={handleDrawerToggle}
      sx={{ pl: 4 }}
    >
      <ListItemText primary="Admin Login" />
    </ListItem>

    <ListItem
      button
      component={Link}
      to="/employee-login"
      onClick={handleDrawerToggle}
      sx={{ pl: 4 }}
    >
      <ListItemText primary="Employee Login" />
    </ListItem>
  </>
)}


        <ListItem button component={Link} to="/register" selected={isActive('/register')} onClick={handleDrawerToggle}>
          <ListItemText primary="Register" sx={{ color: isActive('/register') ? '#ff9800' : 'white' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          padding: '0.5rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            Employee Management System
          </Typography>

          {/* Render drawer icon for mobile view */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            // Render full menu for desktop view
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>



{currentPath !== '/login'  && 
        currentPath !== '/' &&
        currentPath !== '/employee-login' &&
            currentPath !== '/register' &&
              currentPath !== '/verify-username' &&
              currentPath !== '/reset-password' &&

          (!isLoggedIn || !isEmployeeLog) && (
              <Button
                color={isActive('/') ? 'primary' : 'inherit'}
                component={Link}
                to="/"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/') ? '#ff9800' : 'inherit',
                }}
              >
                Home
              </Button>
)}

        
        
    {currentPath !== '/login'  && 
      currentPath !== '/register'  && 
        currentPath !== '/'  && 
        currentPath !== '/employee-login' &&
          currentPath !== '/verify-username' &&
           currentPath !== '/reset-password' &&
          (!isLoggedIn || !isEmployeeLog) && (
             <>
              <Button
                color={isActive('/dashboard') ? 'primary' : 'inherit'}
                component={Link}
                to="/dashboard"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/dashboard') ? '#ff9800' : 'inherit',
                }}
              >
                Dashboard
              </Button>
              <Button
                color={isActive('/employees') ? 'primary' : 'inherit'}
                component={Link}
                to="/employees"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/employees') ? '#ff9800' : 'inherit',
                }}
              >
                Employees
              </Button>
              <Button
                color={isActive('/departments') ? 'primary' : 'inherit'}
                component={Link}
                to="/departments"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/departments') ? '#ff9800' : 'inherit',
                }}
              >
                Departments
              </Button>

              <Button
                color={isActive('/profile') ? 'primary' : 'inherit'}
                component={Link}
                to="/profile"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/profile') ? '#ff9800' : 'inherit',
                }}
              >
                Profile
              </Button>
              </>
        )}



             
              
              {/* Conditional Login/Logout Button */}
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: 'red', // Make logout button red
                  }}
                >
                  Logout
                </Button>
              ) : (
               
   <>
  <Button
    onClick={handleLoginClick}
    sx={{
      fontSize: '1rem',
      fontWeight: 500,
      color: 'inherit',
    }}
  >
    Login
  </Button>

  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem
      component={Link}
      to="/login"
      onClick={handleClose}
    >
      Admin Login
    </MenuItem>

    <MenuItem
      component={Link}
      to="/employee-login"
      onClick={handleClose}
    >
      Employee Login
    </MenuItem>
  </Menu>
</>


              )}





            {!hideMenu && (
              <Button
                color={isActive('/register') ? 'primary' : 'inherit'}
                component={Link}
                to="/register"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/register') ? '#ff9800' : 'inherit',
                }}
              >
                Register
              </Button>
            
              )}

            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
