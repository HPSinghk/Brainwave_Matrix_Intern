import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon
} from '@mui/icons-material';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchCategories,
  createCategory,
  clearError
} from '../store/slices/cashflowSlice';

const Cashflow = () => {
  const dispatch = useDispatch();
  const { transactions, categories, loading, error } = useSelector((state) => state.cashflow);
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'expense',
    color: '#000000'
  });
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    console.log('Component mounted, fetching data...');
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    console.log('Current categories:', categories);
  }, [categories]);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await dispatch(updateTransaction({ 
          id: editingTransaction._id, 
          transactionData: formData 
        })).unwrap();
      } else {
        await dispatch(createTransaction(formData)).unwrap();
      }
      setOpenTransactionDialog(false);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingTransaction(null);
      // Refresh transactions after adding/updating
      dispatch(fetchTransactions());
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure color is a valid hex color
      const categoryData = {
        ...categoryForm,
        color: categoryForm.color || '#000000'
      };

      await dispatch(createCategory(categoryData)).unwrap();
      setOpenCategoryDialog(false);
      setCategoryForm({ name: '', type: 'expense', color: '#000000' });
      // Refresh categories after adding
      dispatch(fetchCategories());
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    setOpenTransactionDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransaction(id)).unwrap();
        // Refresh transactions after deleting
        dispatch(fetchTransactions());
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(Math.abs(amount));
    return type === 'expense' ? `-${formattedAmount}` : `+${formattedAmount}`;
  };

  const getCategoryName =  (categoryId) => {
    const category =    categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.color || '#000000';
  };

  const calculateSummary = () => {
    if (!Array.isArray(transactions)) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      };
    }

    const totalIncome = transactions
      .filter(t => t && t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpense = transactions
      .filter(t => t && t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  };

  const summary = calculateSummary();

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert 
          severity="error" 
          onClose={() => dispatch(clearError())} 
          sx={{ 
            mb: 2,
            borderRadius: 3,
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500
          }}
        >
          {error}
        </Alert>
      )}

      {/* Header Section */}
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
          Cashflow Management
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#718096',
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500
          }}
        >
          Track your income and expenses with detailed categorization
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
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
                  ₹{summary.balance.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <BalanceIcon />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
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
                  ₹{summary.totalIncome.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}>
                <IncomeIcon />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
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
                  ₹{summary.totalExpense.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #f44336, #d32f2f)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
              }}>
                <ExpenseIcon />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenTransactionDialog(true)}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
            },
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500,
            borderRadius: 2
          }}
        >
          Add Transaction
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenCategoryDialog(true)}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5a6fd8',
              background: 'rgba(102, 126, 234, 0.05)',
            },
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 500,
            borderRadius: 2
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Transactions Table */}
      <Paper sx={{ 
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}>
                  Category
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}>
                  Amount
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#2d3748',
                  fontFamily: '"Inter", "Roboto", sans-serif'
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress sx={{ color: '#667eea' }} />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#718096',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500
                      }}
                    >
                      No transactions found. Add your first transaction!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow 
                    key={transaction._id}
                    sx={{ 
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.02)',
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      color: '#2d3748',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 500
                    }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#2d3748',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 500
                    }}>
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(transaction.category._id)}
                        size="small"
                        sx={{
                          background: getCategoryColor(transaction.category._id),
                          color: 'white',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      color: transaction.type === 'income' ? '#4caf50' : '#f44336',
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", sans-serif'
                    }}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(transaction)}
                            sx={{
                              color: '#667eea',
                              '&:hover': {
                                background: 'rgba(102, 126, 234, 0.1)',
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(transaction._id)}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                background: 'rgba(244, 67, 54, 0.1)',
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Transaction Dialog */}
      <Dialog 
        open={openTransactionDialog} 
        onClose={() => setOpenTransactionDialog(false)} 
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
          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleTransactionSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            >
              <MenuItem value="expense">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ExpenseIcon sx={{ color: '#f44336', mr: 1 }} />
                  Expense
                </Box>
              </MenuItem>
              <MenuItem value="income">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IncomeIcon sx={{ color: '#4caf50', mr: 1 }} />
                  Income
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />

            <TextField
              select
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            >
              {categories
                .filter(cat => cat.type === formData.type)
                .map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: category.color,
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {category.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />

            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenTransactionDialog(false)}
            sx={{
              color: '#718096',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTransactionSubmit}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            {editingTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog 
        open={openCategoryDialog} 
        onClose={() => setOpenCategoryDialog(false)} 
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
          Add New Category
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleCategorySubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              sx={{ mb: 2 }}
              required
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />

            <TextField
              select
              fullWidth
              label="Type"
              value={categoryForm.type}
              onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
              sx={{ mb: 2 }}
              required
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            >
              <MenuItem value="expense">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ExpenseIcon sx={{ color: '#f44336', mr: 1 }} />
                  Expense
                </Box>
              </MenuItem>
              <MenuItem value="income">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IncomeIcon sx={{ color: '#4caf50', mr: 1 }} />
                  Income
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Color"
              type="color"
              value={categoryForm.color}
              onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenCategoryDialog(false)}
            sx={{
              color: '#718096',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCategorySubmit}
            disabled={!categoryForm.name || !categoryForm.type}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 500
            }}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cashflow; 