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

function cookieOptions() {
    return { httpOnly: true, expires: new Date(Date.now() + 86400000) }
}

// Bcrypt Salt And Hash

async function hasher(input) {
    const salt = await bcrypt.genSalt(12);
    const hashedOutput = await bcrypt.hash(input, salt);
    return hashedOutput
}

// @desc    Register user
// @route   POST /api/user/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, username, password, password2, pin, security } = req.body;

    // Check For Empty Or Invalid Fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please add a first name')
    } 
    if (!username || username.length < 8) {
        res.status(400);
        throw new Error('Please add a username that is at least 8 characters in length')
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

    if (!Number(pin) || pin.toString().length !== 4) {
        res.status(400);
        throw new Error('Please add a 4 digit numeric pin')
    }

    if (pin.includes(' ')) {
        res.status(400);
        throw new Error('Pin cannot have spaces')
    }

    // Check if security question and answer is blank

    if (!security) {
        res.status(400);
        throw new Error('Please provide a security question and answer')
    }

    if (!security.question) {
        res.status(400);
        throw new Error('Please add a security question')
    }

    if (!security.answer) {
        res.status(400);
        throw new Error('Please add a security answer.')
    }

    if (security.answer.includes(' ')) {
        res.status(400);
        throw new Error('Security answer cannot have spaces')
    }

    // Destructure security

    const { question, answer } = security;

    // Check if user with same username

    const userExists = await User.findOne({ username: username.toLowerCase() });

    if (userExists) {
        res.status(400);
        throw new Error('Username already exists.  Please enter another username')
    }

    // Hash password, PIN and security answer

    const hashedPassword = await hasher(password.toLowerCase());
    const hashedPin = await hasher(pin.toString());
    const hashedAnswer = await hasher(answer.toLowerCase());

    // Encrypt Password

    const encryptedHashedPassword = cryptr.encrypt(hashedPassword);

    // Encrypt Security Question

    const encryptedQuestion = cryptr.encrypt(question);

    // Encrypt Security Answer

    const encryptedHashedAnswer = cryptr.encrypt(hashedAnswer);

    // Create user

    const user = await User.create({
        firstname: cryptr.encrypt(firstname.toLowerCase()),
        username: username.toLowerCase(),
        password: encryptedHashedPassword,
        pin: hashedPin,
        security: {
            question: encryptedQuestion,
            answer: encryptedHashedAnswer
        }
    });

    if (!user) {
        res.status(500);
        throw new Error('Error saving data to MongoDB')
    } else {
        const token = generateToken(user._id)
        res.cookie("token", token, cookieOptions());
        res.status(201).json({ message: 'User Successfully Registered'});
    }
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Check for empty fields

    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }

    if (!password) {
        res.status(400);
        throw new Error('Please enter a password')
    }

    // Find user


    const user = await User.findOne({ username: username.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check password

    if (!await bcrypt.compare(password.toLowerCase(), cryptr.decrypt(user.password))) {
        res.status(401);
        throw new Error('Invalid password')
    } else {
        res.cookie("token", generateToken(user._id), cookieOptions());
        res.status(200).json({ message: 'User successfully logged In'});
    }
});

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Private

const logoutUser = asyncHandler((req, res) => {
    if (req) {
        res.clearCookie("token");
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
            firstname: req.user.firstname,
            username: req.user.username,
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
                id: board._id, tasks: await Task.find({ board: board._id }) })
        }

        res.status(200).json(userData)
    }
});

// @desc    Verify user
// @route   POST /api/user/verify
// @access  Public

const verifyUser = asyncHandler(async (req, res) => {
    const { firstname, username, pin } = req.body;

    // Check for empty fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please enter a first name')
    } 

    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }
    
    if (!Number(pin) || pin.toString().length !== 4) {
        res.status(400);
        throw new Error('Please enter a 4 digit numeric pin')
    }

    // Find users based upon firstname

    const user = await User.findOne({ username: username.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check if fields match user fields

    if (cryptr.decrypt(user.firstname) !== firstname.toLowerCase()) {
        res.status(401);
        throw new Error('Invalid first name')
    }

    if (!await bcrypt.compare(pin.toString(), user.pin)) {
            res.status(401);
            throw new Error('Invalid pin')

    } else {
        res.status(200).json({
            security: {
                question: cryptr.decrypt(user.security.question)
            }
        });
    }
});

// @desc    Verify user
// @route   POST /api/user/reset
// @access  Public

const resetUserPassword = asyncHandler(async (req, res) => {
    const { firstname, username, pin, security, password, password2 } = req.body;

    // Check for empty fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please enter a first name')
    } 
    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }

    if (!Number(pin) || pin.toString().length !== 4) {
        res.status(400);
        throw new Error('Please enter a 4 digit numeric pin')
    }
    if (!password || password.length < 8) {
        res.status(400);
        throw new Error('Please add a password that is at least 8 characters in length')
    }
    if (!password2) {
        res.status(400);
        throw new Error('Please reenter password')
    }
    if (password.toLowerCase() !== password2.toLowerCase()) {
        res.status(400);
        throw new Error('Password entries do not match.  Please reenter matching passwords')
    }

    // Check if security question and answer is blank

    if (!security) {
        res.status(400);
        throw new Error('Please provide a security question and a security answer')
    }

    if (!security.question) {
        res.status(400);
        throw new Error('Please add a security question')
    }

    if (!security.answer || security.answer.includes(' ')) {
        res.status(400);
        throw new Error('Please add a security answer.  Answer cannot have spaces')
    }

    // Check if security answer is blank

    const { answer } = security;

    // Find user

    const user = await User.findOne({ username: username.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check if credentials are valid

    if (firstname.toLowerCase() !== cryptr.decrypt(user.firstname)) {
        res.status(401);
        throw new Error('Invalid first name')
    }

    if (username.toLowerCase() !== user.username) {
        res.status(401);
        throw new Error('Invalid username')
    }

    if (!await bcrypt.compare(pin.toString(), user.pin)) {
        res.status(401);
        throw new Error('Invalid pin')
    }

    if (security.question !== cryptr.decrypt(user.security.question)) {
        res.status(401);
        throw new Error('Invalid security question')
    }

    if (!await bcrypt.compare(answer.toLowerCase(), cryptr.decrypt(user.security.answer))) {
        res.status(401);
        throw new Error('Invalid security answer')
    }

    const updatedPassword = await hasher(password);

    const resetUserCredentials = await User.findByIdAndUpdate(user._id, {
        password: cryptr.encrypt(updatedPassword)
    });

    if (!resetUserCredentials) {
        res.status(500);
        throw new Error('Error updating password')
    } else {
        res.cookie("token", generateToken(user._id), cookieOptions());
        res.status(200).json({ message: 'User password successfully updated'});
    }
});

// @desc    Delete user
// @route   DELETE /api/user/
// @access  Private

const deleteUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }
    if (!password) {
        res.status(400);
        throw new Error('Please enter a password')
    }

    // User ID

    const id = req.user._id;

    // Verify User Credentials

    const checkUser = await User.findById(id);

    // Check username

    if (username.toLowerCase() !== checkUser.username.toLowerCase()) {
        res.status(401);
        throw new Error('Invalid username')
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
            id
        });
    }
});


module.exports = { registerUser, loginUser, logoutUser, getUserData, verifyUser, resetUserPassword, deleteUser }