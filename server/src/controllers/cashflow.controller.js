const { validationResult } = require('express-validator');
const Cashflow = require('../models/cashflow.model');
const Category = require('../models/category.model');

// @desc    Create new cashflow entry
// @route   POST /api/cashflow
// @access  Private
exports.createCashflow = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      amount,
      description,
      category,
      date,
      paymentMethod,
      receipt,
      tags,
      isRecurring,
      recurringDetails
    } = req.body;

    const cashflow = new Cashflow({
      user: req.user._id,
      type,
      amount,
      description,
      category,
      date,
      paymentMethod,
      receipt,
      tags,
      isRecurring,
      recurringDetails
    });

    await cashflow.save();
    res.status(201).json(cashflow);
  } catch (error) {
    console.error('Error creating cashflow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all cashflow entries
// @route   GET /api/cashflow
// @access  Private
exports.getCashflows = async (req, res) => {
  try {
    const { startDate, endDate, category, type, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Cashflow.countDocuments(query);

    const cashflows = await Cashflow.find(query)
      .populate({
        path: 'category',
        select: 'name color icon type',
        match: { user: req.user._id }
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Filter out cashflows with null categories and ensure proper data structure
    const filteredCashflows = cashflows
      .filter(cashflow => cashflow.category)
      .map(cashflow => ({
        ...cashflow,
        amount: Number(cashflow.amount),
        category: {
          _id: cashflow.category._id,
          name: cashflow.category.name,
          color: cashflow.category.color,
          type: cashflow.category.type
        }
      }));

    res.json({
      cashflows: filteredCashflows,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching cashflows:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get cashflow summary
// @route   GET /api/cashflow/summary
// @access  Private
exports.getCashflowSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for the user
    const transactions = await Cashflow.find({ user: userId })
      .sort({ date: -1 })
      .limit(30)
      .populate('category', 'name');

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Get category distribution
    const categories = await Category.find({ user: userId });
    
    const categoryDistribution = {
      income: await Promise.all(categories
        .filter(c => c.type === 'income')
        .map(async (category) => {
          const amount = await Cashflow.aggregate([
            { $match: { user: userId, category: category._id, type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);
          return {
            name: category.name,
            amount: amount[0]?.total || 0
          };
        })),
      expense: await Promise.all(categories
        .filter(c => c.type === 'expense')
        .map(async (category) => {
          const amount = await Cashflow.aggregate([
            { $match: { user: userId, category: category._id, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);
          return {
            name: category.name,
            amount: amount[0]?.total || 0
          };
        }))
    };

    res.json({
      totalIncome,
      totalExpense,
      balance,
      transactions: transactions.map(t => ({
        date: t.date,
        amount: t.amount,
        type: t.type,
        category: t.category.name
      })),
      categoryDistribution
    });
  } catch (error) {
    console.error('Error getting cashflow summary:', error);
    res.status(500).json({ message: 'Error getting cashflow summary' });
  }
};

// @desc    Get cashflow by ID
// @route   GET /api/cashflow/:id
// @access  Private
exports.getCashflowById = async (req, res) => {
  try {
    const cashflow = await Cashflow.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('category', 'name icon color');

    if (!cashflow) {
      return res.status(404).json({ message: 'Cashflow entry not found' });
    }

    res.json(cashflow);
  } catch (error) {
    console.error('Error fetching cashflow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cashflow
// @route   PUT /api/cashflow/:id
// @access  Private
exports.updateCashflow = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cashflow = await Cashflow.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!cashflow) {
      return res.status(404).json({ message: 'Cashflow entry not found' });
    }

    const {
      type,
      amount,
      description,
      category,
      date,
      paymentMethod,
      receipt,
      tags,
      isRecurring,
      recurringDetails
    } = req.body;

    cashflow.type = type || cashflow.type;
    cashflow.amount = amount || cashflow.amount;
    cashflow.description = description || cashflow.description;
    cashflow.category = category || cashflow.category;
    cashflow.date = date || cashflow.date;
    cashflow.paymentMethod = paymentMethod || cashflow.paymentMethod;
    cashflow.receipt = receipt || cashflow.receipt;
    cashflow.tags = tags || cashflow.tags;
    cashflow.isRecurring = isRecurring !== undefined ? isRecurring : cashflow.isRecurring;
    cashflow.recurringDetails = recurringDetails || cashflow.recurringDetails;

    await cashflow.save();
    res.json(cashflow);
  } catch (error) {
    console.error('Error updating cashflow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete cashflow
// @route   DELETE /api/cashflow/:id
// @access  Private
exports.deleteCashflow = async (req, res) => {
  try {
    const cashflow = await Cashflow.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!cashflow) {
      return res.status(404).json({ message: 'Cashflow entry not found' });
    }

    await cashflow.deleteOne();
    res.json({ message: 'Cashflow entry removed' });
  } catch (error) {
    console.error('Error deleting cashflow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard summary
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for the user
    const transactions = await Cashflow.find({ user: userId })
      .sort({ date: -1 })
      .limit(30)
      .populate('category', 'name');

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Get category distribution
    const categories = await Category.find({ user: userId });
    
    const categoryDistribution = {
      income: await Promise.all(categories
        .filter(c => c.type === 'income')
        .map(async (category) => {
          const amount = await Cashflow.aggregate([
            { $match: { user: userId, category: category._id, type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);
          return {
            name: category.name,
            amount: amount[0]?.total || 0
          };
        })),
      expense: await Promise.all(categories
        .filter(c => c.type === 'expense')
        .map(async (category) => {
          const amount = await Cashflow.aggregate([
            { $match: { user: userId, category: category._id, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]);
          return {
            name: category.name,
            amount: amount[0]?.total || 0
          };
        }))
    };

    res.json({
      totalIncome,
      totalExpense,
      balance,
      transactions: transactions.map(t => ({
        date: t.date,
        amount: t.amount,
        type: t.type,
        category: t.category.name
      })),
      categoryDistribution
    });
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({ message: 'Error getting dashboard summary' });
  }
}; 