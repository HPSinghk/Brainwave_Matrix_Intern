import { configureStore } from '@reduxjs/toolkit';
import cashflowReducer from './slices/cashflowSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    cashflow: cashflowReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 

export default store; 