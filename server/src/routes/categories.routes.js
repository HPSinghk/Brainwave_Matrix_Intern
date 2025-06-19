const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const categoryController = require('../controllers/category.controller');

// All routes are protected with auth middleware
router.use(auth);

// @route   GET /api/categories
// @desc    Get all categories for current user
// @access  Private
router.get('/', categoryController.getCategories);

// @route   POST /api/categories
// @desc    Create a category
// @access  Private
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('color', 'Color must be a valid hex color')
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  ],
  categoryController.createCategory
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put(
  '/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
    check('color', 'Color must be a valid hex color')
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  ],
  categoryController.updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 