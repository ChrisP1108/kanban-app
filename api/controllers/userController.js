const asyncHandler = require('express-async-handler');

// @desc    Register user
// @route   POST /api/user/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Register User' })
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Login User' })
});

// @desc    Get user data
// @route   GET /api/user/data
// @access  Private

const getUserData = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get User Data' })
});

// @desc    Verify user
// @route   POST /api/user/verify
// @access  Public

const verifyUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Verify User For Resetting Password' })
});

// @desc    Verify user
// @route   POST /api/user/reset
// @access  Public

const resetUserPassword = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Reset User Password' })
});


module.exports = { registerUser, loginUser, getUserData, verifyUser, resetUserPassword }