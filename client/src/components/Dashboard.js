import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchCategories } from '../store/slices/cashflowSlice';
import CategoryDistribution from './dashboard/CategoryDistribution';
import '../utils/chartConfig'; // Import Chart.js configuration

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions,loading } = useSelector((state) => state.cashflow);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  // Calculate summary from Redux store data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Prepare data for line chart
  const recentTransactions = transactions
    .slice(0, 30)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = {
    labels: recentTransactions.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Income',
        data: recentTransactions
          .filter(t => t.type === 'income')
          .map(t => t.amount),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expense',
        data: recentTransactions
          .filter(t => t.type === 'expense')
          .map(t => t.amount),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: '"Inter", "Roboto", sans-serif',
            size: 12,
          },
          color: '#2d3748',
        },
      },
      title: {
        display: true,
        text: 'Recent Financial Activity',
        font: {
          family: '"Poppins", "Roboto", sans-serif',
          size: 16,
          weight: '600',
        },
        color: '#2d3748',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: '"Inter", "Roboto", sans-serif',
            size: 12,
          },
          color: '#718096',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: '"Inter", "Roboto", sans-serif',
            size: 12,
          },
          color: '#718096',
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#2d3748',
            fontFamily: '"Poppins", "Roboto", sans-serif',
            mb: 1
          }}
        >
          Welcome to Your Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#718096',
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500
          }}
        >
          Track your financial health and manage your budget effectively
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 3, 
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
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2d3748',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    mb: 1
                  }}
                >
                  Total Balance
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#667eea',
                    fontFamily: '"Poppins", "Roboto", sans-serif'
                  }}
                >
                  ₹{balance.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <AccountBalanceIcon />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(76, 175, 80, 0.1)',
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
              background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2d3748',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    mb: 1
                  }}
                >
                  Total Income
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#4caf50',
                    fontFamily: '"Poppins", "Roboto", sans-serif'
                  }}
                >
                  ₹{totalIncome.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ 
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(244, 67, 54, 0.1)',
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
              background: 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)',
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2d3748',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    mb: 1
                  }}
                >
                  Total Expense
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#f44336',
                    fontFamily: '"Poppins", "Roboto", sans-serif'
                  }}
                >
                  ₹{totalExpense.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ 
                background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
              }}>
                <TrendingDownIcon />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(33, 150, 243, 0.1)',
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
              background: 'linear-gradient(90deg, #2196f3 0%, #1976d2 100%)',
            }
          }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" position="relative" zIndex={1}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#2d3748',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    mb: 1
                  }}
                >
                  Transactions
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#2196f3',
                    fontFamily: '"Poppins", "Roboto", sans-serif'
                  }}
                >
                  {transactions.length}
                </Typography>
              </Box>
              <Avatar sx={{ 
                background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
              }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
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
            <Box sx={{ height: 400, position: 'relative', zIndex: 1 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <CategoryDistribution />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 