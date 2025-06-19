import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, getCurrentUser, logout } from '../store/slices/authSlice';
import axios from '../utils/axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { transactions } = useSelector((state) => state.cashflow);

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordError, setPasswordError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user data when component mounts
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Calculate user statistics
  const userStats = React.useMemo(() => {
    const totalTransactions = transactions.length;
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;
    const avgTransaction = totalTransactions > 0 ? (totalIncome + totalExpense) / totalTransactions : 0;

    return {
      totalTransactions,
      totalIncome,
      totalExpense,
      balance,
      avgTransaction
    };
  }, [transactions]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    // Clear password error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    console.log('handleChangePassword called');
    console.log('Password data:', passwordData);
    
    // Clear previous errors
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending change password request...');
      const response = await axios.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      console.log('Change password response:', response.data);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordDialog = () => {
    setPasswordDialog(true);
    setPasswordError('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialog(false);
    setPasswordError('');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout locally even if server logout fails
      dispatch(logout());
      navigate('/login');
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ 
      height: '100%',
      borderRadius: 4,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: color === 'primary' ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' :
                   color === 'success' ? 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)' :
                   color === 'error' ? 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)' :
                   'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
      }
    }}>
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ 
            background: color === 'primary' ? 'linear-gradient(45deg, #667eea, #764ba2)' :
                       color === 'success' ? 'linear-gradient(45deg, #4caf50, #45a049)' :
                       color === 'error' ? 'linear-gradient(45deg, #f44336, #d32f2f)' :
                       'linear-gradient(45deg, #2196f3, #1976d2)',
            color: 'white',
            mr: 2,
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {icon}
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2d3748',
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", sans-serif'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#718096',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 500
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: color === 'primary' ? '#667eea' :
                   color === 'success' ? '#4caf50' :
                   color === 'error' ? '#f44336' :
                   '#2196f3',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontFamily: '"Poppins", "Roboto", sans-serif'
          }}
        >
          {typeof value === 'number' && title === 'Transactions' 
            ? value.toLocaleString() 
            : typeof value === 'number' 
              ? `₹${value.toLocaleString()}` 
              : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ 
            mb: 3,
            borderRadius: 3,
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500
          }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  mr: 3,
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      fontFamily: '"Poppins", "Roboto", sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {user?.name || 'User'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 500
                    }}
                  >
                    {user?.email || 'user@example.com'}
                  </Typography>
                  <Chip 
                    label="Active User" 
                    color="success" 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#4caf50',
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(!editMode)}
                  sx={{ 
                    mr: 2,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                    },
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              fontFamily: '"Poppins", "Roboto", sans-serif',
              color: '#2d3748'
            }}
          >
            Financial Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Balance"
                value={userStats.balance}
                icon={<AccountBalanceIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Income"
                value={userStats.totalIncome}
                icon={<TrendingUpIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Expense"
                value={userStats.totalExpense}
                icon={<TrendingDownIcon />}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Transactions"
                value={userStats.totalTransactions}
                icon={<PersonIcon />}
                color="info"
                subtitle="Total count"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} position="relative" zIndex={1}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontFamily: '"Poppins", "Roboto", sans-serif',
                  color: '#2d3748'
                }}
              >
                Personal Information
              </Typography>
              {editMode && (
                <Box>
                  <IconButton 
                    color="primary" 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                      },
                      '&.Mui-disabled': {
                        background: '#e2e8f0',
                        color: '#a0aec0',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => setEditMode(false)}
                    sx={{
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                      }
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }} position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#718096',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Full Name
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#2d3748',
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                >
                  {user?.name || 'Not provided'}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

            <Box sx={{ mb: 3 }} position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon sx={{ mr: 2, color: '#667eea' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#718096',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Email Address
                </Typography>
              </Box>
              {editMode ? (
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#2d3748',
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                >
                  {user?.email || 'Not provided'}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

            <Box position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarIcon sx={{ mr: 2, color: '#667eea' }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#718096',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 500
                  }}
                >
                  Member Since
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}
              >
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Account Security */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                fontFamily: '"Poppins", "Roboto", sans-serif',
                color: '#2d3748'
              }}
            >
              Account Security
            </Typography>

            <Box sx={{ mb: 3 }} position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center">
                  <SecurityIcon sx={{ mr: 2, color: '#4caf50' }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#2d3748',
                      fontFamily: '"Inter", "Roboto", sans-serif'
                    }}
                  >
                    Password
                  </Typography>
                </Box>
                <Chip 
                  label="Secure" 
                  color="success" 
                  size="small" 
                  sx={{ 
                    background: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    fontWeight: 600
                  }} 
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#718096',
                  mb: 2,
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}
              >
                Last changed: {user?.passwordChangedAt ? new Date(user.passwordChangedAt).toLocaleDateString() : 'Unknown'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={handleOpenPasswordDialog}
                size="small"
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    background: 'rgba(102, 126, 234, 0.05)',
                  },
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 500
                }}
              >
                Change Password
              </Button>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(102, 126, 234, 0.1)' }} />

            <Box position="relative" zIndex={1}>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ mr: 2, color: '#667eea' }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#2d3748',
                    fontFamily: '"Inter", "Roboto", sans-serif'
                  }}
                >
                  Account Status
                </Typography>
              </Box>
              <Chip 
                label="Active" 
                color="success" 
                sx={{ 
                  mr: 1,
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#4caf50',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 600
                }} 
              />
              <Chip 
                label="Verified" 
                color="primary" 
                sx={{ 
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 600
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialog} 
        onClose={handleClosePasswordDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: '"Poppins", "Roboto", sans-serif',
          fontWeight: 700,
          color: '#2d3748',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center'
        }}>
          Change Password
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {passwordError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                fontFamily: '"Inter", "Roboto", sans-serif',
                fontWeight: 500
              }}
            >
              {passwordError}
            </Alert>
          )}
          <TextField
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            margin="normal"
            error={!!passwordError && passwordError.includes('Current password')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
          <TextField
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            error={!!passwordError && (passwordError.includes('New password') || passwordError.includes('passwords do not match'))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            error={!!passwordError && passwordError.includes('passwords do not match')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClosePasswordDialog}
            sx={{
              color: '#718096',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 