import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store/store';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Cashflow from './components/Cashflow';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8b9df0',
      dark: '#4c63d2',
      lighter: '#e8ecff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6bc4',
      dark: '#5a3a7a',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.3s ease',
        },
        contained: {
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
          <Routes>
            {/* Auth routes with AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes with Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cashflow" element={<Cashflow />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add other protected routes here */}
              </Route>
            </Route>
          </Routes>
      </Router>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
