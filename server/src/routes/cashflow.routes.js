const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const cashflowController = require('../controllers/cashflow.controller.js');

// All routes are protected with auth middleware
router.use(auth);

// @route   GET /api/cashflow
// @desc    Get all cashflow entries for current user
// @access  Private
router.get('/', cashflowController.getCashflows);

// @route   GET /api/cashflow/summary
// @desc    Get cashflow summary and distribution
// @access  Private
router.get('/summary', cashflowController.getCashflowSummary);

// @route   POST /api/cashflow
// @desc    Create a cashflow entry
// @access  Private
router.post(
  '/',
  [
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('amount', 'Amount is required and must be positive').isFloat({ min: 0 }),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601()
  ],
  cashflowController.createCashflow
);

// @route   PUT /api/cashflow/:id
// @desc    Update a cashflow entry
// @access  Private
router.put(
  '/:id',
  [
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('amount', 'Amount is required and must be positive').isFloat({ min: 0 }),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601()
  ],
  cashflowController.updateCashflow
);

// @route   DELETE /api/cashflow/:id
// @desc    Delete a cashflow entry
// @access  Private
router.delete('/:id', cashflowController.deleteCashflow);

module.exports = router; 