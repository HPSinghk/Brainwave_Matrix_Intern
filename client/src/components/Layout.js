import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/slices/authSlice';

const drawerWidth = 280;

const mainMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Cashflow', icon: <ReceiptIcon />, path: '/cashflow' }
];

const bottomMenuItems = [
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' }
];

const Layout = () => {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontFamily: '"Poppins", "Roboto", sans-serif'
          }}
        >
          💰 Budget Tracker
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            opacity: 0.8,
            fontFamily: '"Inter", "Roboto", sans-serif'
          }}
        >
          Smart Financial Management
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ flex: 1, p: 2 }}>
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#fff',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                    transition: 'all 0.3s ease',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 500,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section with Profile */}
      <Box sx={{ 
        p: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        <List>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#fff',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                    transition: 'all 0.3s ease',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 500,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Info */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 2,
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}
              >
                {user?.name || 'User'}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.8,
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}
              >
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label="Active" 
            size="small" 
            sx={{ 
              background: 'rgba(76, 175, 80, 0.2)',
              color: '#4caf50',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }} 
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' }, 
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              fontFamily: '"Poppins", "Roboto", sans-serif',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {mainMenuItems.find((item) => item.path === location.pathname)?.text || 
             bottomMenuItems.find((item) => item.path === location.pathname)?.text || 
             'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 