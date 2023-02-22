const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Board = require('../models/boardModel');
const Task = require('../models/taskModel');

// Generate JWT (encrypted)

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// Cookie Options

function cookieOptions(time) {
    const expirationTime = time || 86400000;
    return { httpOnly: true, expires: new Date(Date.now() + expirationTime) }
}

// Bcrypt Salt And Hash

async function hasher(input) {
    const salt = await bcrypt.genSalt(12);
    const hashedOutput = await bcrypt.hash(input, salt);
    return hashedOutput;
}

// Generate Random Key 

function generateKey() {
    return (Math.ceil(Math.random() * 899999) + 100000).toString();
}

// Verify Valid Email

function verifyValidEmail(email) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return email.match(regex);
}

// @desc    Check For.  Ensure that user email is valid prior to registering
// @route   POST /api/user/validate
// @access  Public

const validateUser = asyncHandler(async (req, res) => {
    const { email, registering } = req.body;

    // Check that email is in body

    if (!email) {
        res.status(400);
        throw new Error('Please add an email')
    } 

    // Check that email is valid

    if (!verifyValidEmail(email)) {
        res.status(400);
        throw new Error('Please enter a valid email')
    }

    // Check if user with same email exists if user is attempting to register.  If resetting password, no need to check on this route.

    if (registering) {

        const emailExists = await User.findOne({ email: email.toLowerCase() });

        if (emailExists) {
            res.status(400);
            throw new Error('User email already exists.  Please enter another email')
        }

    }

    // Generate Random Six Digit Number Key For Email Verification

    const key = generateKey();

    const hashedKey = await hasher(key);

    res.cookie("key", hashedKey, cookieOptions(300000));
    res.status(200).json({ message: 'Temporary Number Key Generated And Emailed To User For Verification', key });
});


// @desc    Finish Register user
// @route   POST /api/user/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { key, email, password, password2 } = req.body;

    // Check For Empty Or Invalid Fields

    if (!key) {
        res.status(400);
        throw new Error('Email verification key must be provided')
    }

    if (!email) {
        res.status(400);
        throw new Error('Please add an email')
    } 

    if (!password || password.length < 8) {
        res.status(400);
        throw new Error('Please add a password that is at least 8 characters in length')
    }
    if (!password2) {
        res.status(400);
        throw new Error('Please reenter password')
    }
    if (password !== password2) {
        res.status(400);
        throw new Error('Password entries do not match.  Please reenter matching passwords')
    }

    // Checks that cookie for key exists

    if (!req.cookies.key) {
        res.status(400);
        throw new Error('Could not verify key.  Please try again and do not clear browser cookies.')
    }

    // Check that key user provided matches with cookie key that was hashed

    if (!await bcrypt.compare(key, req.cookies.key)) {
        res.status(401);
        throw new Error('Invalid key provided. Unauthorized. Please try again')
    }

    // Check that email is valid

    if (!verifyValidEmail(email)) {
        res.status(400);
        throw new Error('Please add a valid email')
    }

    // Check if user with same email exists

    const emailExists = await User.findOne({ email: email.toLowerCase() });

    if (emailExists) {
        res.status(400);
        throw new Error('User email already exists.  Please enter another email')
    }

    // Hash password, PIN and security answer

    const hashedPassword = await hasher(password.toLowerCase());

    // Encrypt Password

    const encryptedHashedPassword = cryptr.encrypt(hashedPassword);

    // Create user

    const user = await User.create({
        email: email.toLowerCase(),
        password: encryptedHashedPassword
    });

    if (!user) {
        res.status(500);
        throw new Error('Error saving data to MongoDB')
    } else {
        res.clearCookie("key");
        res.cookie("token", generateToken(user._id), cookieOptions(null));
        res.status(201).json({ message: 'User Successfully Registered'});
    }
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for empty fields

    if (!email) {
        res.status(400);
        throw new Error('Please enter an email')
    }

    if (!password) {
        res.status(400);
        throw new Error('Please enter a password')
    }

    // Find user

    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('User email does not exist')
    }

    // Check password

    if (!await bcrypt.compare(password.toLowerCase(), cryptr.decrypt(user.password))) {
        res.status(401);
        throw new Error('Invalid password')
    } else {
        res.cookie("token", generateToken(user._id), cookieOptions(null));
        res.status(200).json({ message: 'User successfully logged In'});
    }
});

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Private

const logoutUser = asyncHandler((req, res) => {
    if (req) {
        res.clearCookie("token");
        res.clearCookie("key");
        res.status(200).json({ message: 'User successfully logged out'});
    }
});

// @desc    Get user data
// @route   GET /api/user/data
// @access  Private

const getUserData = asyncHandler(async (req, res) => {

    // Get boards that user created

    const userBoards = await Board.find({ user: req.user._id })

    const userData = {
        user: {
            email: req.user.email,
            _id: req.user._id,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
            __v: req.user.__v
        },
        boards: []
    }

    // Check if user has any boards saved

    if (!userBoards.length) {
        res.status(200).json(userData);
    } else {
    
        // Map tasks pertaining to each board if boards found for user

        for (board of userBoards) {
            userData.boards.push({ name: board.name, columns: board.columns, 
                _id: board._id, user: board.user, createdAt: board.createdAt,
                updatedAt: board.updatedAt, __v: board.__v,
                tasks: await Task.find({ board: board._id }) })
        }

        res.status(200).json(userData)
    }
});

// @desc    Reset User Password
// @route   POST /api/user/reset
// @access  Public

const resetUserPassword = asyncHandler(async (req, res) => {
    const { key, email, password, password2 } = req.body;

    // Check For Empty Or Invalid Fields

    if (!key) {
        res.status(400);
        throw new Error('Email verification key must be provided')
    }

    if (!email) {
        res.status(400);
        throw new Error('Please add an email')
    }

    if (!password || password.length < 8) {
        res.status(400);
        throw new Error('Please add a password that is at least 8 characters in length')
    }
    if (!password2) {
        res.status(400);
        throw new Error('Please reenter password')
    }
    if (password !== password2) {
        res.status(400);
        throw new Error('Password entries do not match.  Please reenter matching passwords')
    }

    // Checks that cookie for key exists

    if (!req.cookies.key) {
        res.status(400);
        throw new Error('Could not verify key.  Please try again and do not clear browser cookies.')
    }

    // Check that key user provided matches with cookie key that was hashed

    if (!await bcrypt.compare(key, req.cookies.key)) {
        res.status(401);
        throw new Error('Invalid key provided. Unauthorized. Please try again.')
    }

    // Check that email is valid

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!email.match(regex)) {
        res.status(400);
        throw new Error('Please provide a valid email')
    }

    // Find user

    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('No user with corresponding email exists.')
    }

    // Update User Password

    const updatedPassword = await hasher(password);

    const resetUserPassword = await User.findByIdAndUpdate(user._id, {
        password: cryptr.encrypt(updatedPassword)
    });

    if (!resetUserPassword) {
        res.status(500);
        throw new Error('Error updating password')
    } else {
        res.clearCookie("key");
        res.cookie("token", generateToken(user._id), cookieOptions(null));
        res.status(200).json({ message: 'User password successfully updated'});
    }
});

// @desc    Delete user
// @route   DELETE /api/user/
// @access  Private

const deleteUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Check for empty fields

    if (!email) {
        res.status(400);
        throw new Error('Please enter an email')
    }
    if (!password) {
        res.status(400);
        throw new Error('Please enter a password')
    }

    // Check that email is valid

    if (!verifyValidEmail(email)) {
        res.status(400);
        throw new Error('Please enter a valid email')
    }

    // User ID

    const id = req.user._id;

    // Verify User Credentials

    const checkUser = await User.findById(id);

    // Check username

    if (email.toLowerCase() !== checkUser.email.toLowerCase()) {
        res.status(401);
        throw new Error('Invalid email')
    }

    // Check password

    if (!await bcrypt.compare(password.toLowerCase(), cryptr.decrypt(checkUser.password))) {
        res.status(401);
        throw new Error('Invalid password')
    }

    // Delete User Profile, User Boards, And User Tasks

    const deleteUserProfile = await User.findByIdAndDelete(id);
    const deleteUserBoards = await Board.deleteMany({ user: id });
    const deleteUserTasks = await Task.deleteMany({ user: id });

    if (!deleteUserProfile || !deleteUserBoards || !deleteUserTasks) {
        res.status(500);
        throw new Error('An error occured when deleting user')
    } else {
        res.status(200).json({
            _id: id
        });
    }
});


module.exports = { 
    validateUser, registerUser, loginUser, 
    logoutUser, getUserData, resetUserPassword, deleteUser 
}