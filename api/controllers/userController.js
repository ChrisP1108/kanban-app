const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generate JWT

function generateToken(id) {
    return jwt.sign({ id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// @desc    Register user
// @route   POST /api/user/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, pin } = req.body;

    // Check For Empty Or Invalid Fields

    if (!firstName) {
        res.status(400);
        throw new Error('Please add a first name')
    } 
    if (!lastName) {
        res.status(400);
        throw new Error('Please add a last name')
    }

    const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (!email || !email.match(emailFormat)) {
        res.status(400);
        throw new Error('Please add a valid email')
    }
    if (!password || password.length < 8) {
        res.status(400);
        throw new Error('Please add a password that is at least 8 characters in length')
    }
    if (!pin || pin.length !== 4) {
        res.status(400);
        throw new Error('Please add a 4 digit pin')
    }

    // Check if user with same email exists

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    // Hash password and PIN

    async function hasher(input) {
        const salt = await bcrypt.genSalt(10);
        const hashedOutput = await bcrypt.hash(input, salt);
        return hashedOutput
    }

    const hashedPassword = await hasher(password)
    const hashedPin = await hasher(pin);

    // Create user

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        pin: hashedPin
    });

    if (user) {
        res.status(201).json( {
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data')
    }
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
// @access  Private

const resetUserPassword = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Reset User Password' })
});


module.exports = { registerUser, loginUser, getUserData, verifyUser, resetUserPassword }