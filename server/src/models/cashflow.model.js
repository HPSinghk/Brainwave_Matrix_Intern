const mongoose = require('mongoose');

const cashflowSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify cashflow type'],
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
cashflowSchema.index({ user: 1, date: -1 });
cashflowSchema.index({ user: 1, category: 1 });
cashflowSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Cashflow', cashflowSchema); 