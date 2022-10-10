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


module.exports = { registerUser, loginUser }