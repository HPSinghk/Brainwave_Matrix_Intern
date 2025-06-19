const { validationResult } = require('express-validator');
const Category = require('../models/category.model');

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, color } = req.body;

    // Check if category already exists for user
    const existingCategory = await Category.findOne({
      user: req.user._id,
      name: name.toLowerCase()
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      user: req.user._id,
      name: name.toLowerCase(),
      type,
      color: color || '#000000' // Use provided color or default
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort({ name: 1 })
      .lean(); // Use lean() for better performance
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    }).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, icon, color, type } = req.body;

    // Check if new name already exists for the same user
    if (name) {
      const existingCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        user: req.user._id,
        name: name.toLowerCase()
      });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $set: {
          name: name ? name.toLowerCase() : undefined,
          description: description !== undefined ? description : undefined,
          icon: icon || undefined,
          color: color || undefined,
          type: type || undefined
        }
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is default
    if (category.isDefault) {
      return res.status(400).json({ message: 'Cannot delete default category' });
    }

    // Delete the category using findByIdAndDelete
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 