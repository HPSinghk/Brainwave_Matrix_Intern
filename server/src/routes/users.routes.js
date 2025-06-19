const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const userController = require('../controllers/user.controller.js');

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update current user
// @access  Private
router.put(
  '/me',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.updateCurrentUser
);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  userController.updateProfile
);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  [
    auth,
    [
      check('currentPassword', 'Current password is required').exists(),
      check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ]
  ],
  userController.changePassword
);

// @route   DELETE /api/users/me
// @desc    Delete current user
// @access  Private
router.delete('/me', auth, userController.deleteCurrentUser);

module.exports = router; 