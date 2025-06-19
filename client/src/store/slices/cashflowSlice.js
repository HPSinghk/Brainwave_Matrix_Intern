import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'cashflow/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching transactions...');
      const response = await axios.get('/cashflow');
      console.log('API Response:', response.data);
      
      // Handle the response format from the server
      const transactions = response.data.cashflows || response.data || [];
      
      console.log('Processed transactions:', transactions);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'cashflow/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/cashflow', transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'cashflow/updateTransaction',
  async ({ id, transactionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/cashflow/${id}`, transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'cashflow/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/cashflow/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'cashflow/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/categories');
      console.log('Categories API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'cashflow/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      console.log('Creating category:', categoryData);
      const response = await axios.post('/categories', categoryData);
      console.log('Category created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

const initialState = {
  transactions: [],
  categories: [],
  loading: false,
  error: null,
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryDistribution: {
      income: [],
      expense: []
    }
  }
};

const cashflowSlice = createSlice({
  name: 'cashflow',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transactions = []; // Reset transactions while loading
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.transactions = []; // Reset transactions on error
      })
      // Create Transaction
      .addCase(createTransaction.fulfilled, (state, action) => {
        if (Array.isArray(state.transactions)) {
          state.transactions.unshift(action.payload);
        } else {
          state.transactions = [action.payload];
        }
      })
      // Update Transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        if (Array.isArray(state.transactions)) {
          const index = state.transactions.findIndex(t => t._id === action.payload._id);
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        }
      })
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        if (Array.isArray(state.transactions)) {
          state.transactions = state.transactions.filter(t => t._id !== action.payload);
        }
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
        console.log('Categories updated in state:', state.categories);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.categories = [];
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        if (Array.isArray(state.categories)) {
          state.categories.push(action.payload);
          console.log('Category added to state:', action.payload);
        } else {
          state.categories = [action.payload];
        }
      });
  }
});

export const { clearError } = cashflowSlice.actions;
export default cashflowSlice.reducer; 