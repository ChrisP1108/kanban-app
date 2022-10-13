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
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return cryptr.encrypt(token)
}

// Bcrypt Salt And Hash

async function hasher(input) {
    const salt = await bcrypt.genSalt(10);
    const hashedOutput = await bcrypt.hash(input, salt);
    return hashedOutput
}

// @desc    Register user
// @route   POST /api/user/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, password, password2, pin, security } = req.body;

    // Check For Empty Or Invalid Fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please add a first name')
    } 
    if (!lastname) {
        res.status(400);
        throw new Error('Please add a last name')
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
    if (!pin || pin.length !== 4) {
        res.status(400);
        throw new Error('Please add a 4 digit pin')
    }

    // Check if security question and answer is blank

    const { question, answer } = security;

    if (!question) {
        res.status(400);
        throw new Error('Please add a security question')
    }

    if (!answer || answer.includes(' ')) {
        res.status(400);
        throw new Error('Please add a security answer.  Answer cannot have spaces')
    }

    // Check if user with same email exists

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error('Username already exists.  Please enter another username')
    }

    // Hash password, PIN and security answer

    const hashedPassword = await hasher(password);
    const hashedPin = await hasher(pin);
    const hashedAnswer = await hasher(answer);

    // Encrypt Security Question

    const encryptedQuestion = cryptr.encrypt(question);

    // Create user

    const user = await User.create({
        firstname,
        lastname,
        username,
        password: hashedPassword,
        pin: hashedPin,
        security: {
            question: encryptedQuestion,
            answer: hashedAnswer
        }
    });

    if (!user) {
        res.status(500);
        throw new Error('Error Saving Data To MongoDB')
    } else {
        res.status(201).json( {
            token: generateToken(user._id)
        });
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

    const user = await User.findOne({ username });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check password

    if (!await bcrypt.compare(password, user.password)) {
        res.status(401);
        throw new Error('Invalid password')
    } else {
        res.status(200).json( {
            token: generateToken(user._id)
        });
    }
});

// @desc    Get user data
// @route   GET /api/user/data
// @access  Private

const getUserData = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(401)
        throw new Error('Invalid User ID. Not authorized.')
    } 

    // Get boards that user created

    const userBoards = await Board.find({ user: user._id })

    // Check if user has any boards saved

    if (!userBoards.length) {
        res.status(200).json([]);
    } 
    
    // Map tasks pertaining to each board if boards found for user

    const userData = userBoards.map(async board => {
        return { name: board.name, columns: board.columns, 
            tasks: await Task.find({ board: board._id })
        }
    });

    res.status(200).json(userData)
});

// @desc    Verify user
// @route   POST /api/user/verify
// @access  Public

const verifyUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, pin } = req.body;

    // Check for empty fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please enter a first name')
    } 
    if (!lastname) {
        res.status(400);
        throw new Error('Please enter a last name')
    }
    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }
    if (!pin || pin.length !== 4) {
        res.status(400);
        throw new Error('Please enter a 4 digit pin')
    }

    // Find user

    const user = await User.findOne({ username });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check if fields match user fields

    if (user.firstname !== firstname || user.lastname !== lastname 
        || user.username !== username || !await bcrypt.compare(pin, user.pin)) 
        {
            res.status(401);
            throw new Error('Invalid Credentials')
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
    const { firstname, lastname, username, pin, security, password, password2 } = req.body;

    // Check for empty fields

    if (!firstname) {
        res.status(400);
        throw new Error('Please enter a first name')
    } 
    if (!lastname) {
        res.status(400);
        throw new Error('Please enter a last name')
    }
    if (!username) {
        res.status(400);
        throw new Error('Please enter a username')
    }
    if (!pin || pin.length !== 4) {
        res.status(400);
        throw new Error('Please enter a 4 digit pin')
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

    // Check if security answer is blank

    const { answer } = security;

    if (!answer || answer.includes(' ')) {
        res.status(400);
        throw new Error('Please enter security answer.  Answer cannot have spaces')
    }

    // Find user

    const user = await User.findOne({ username });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('Username does not exist')
    }

    // Check if security answer matches answer in database

    if (!await bcrypt.compare(answer, user.security.answer)) {
        res.status(401);
        throw new Error('Invalid Recovery Credentials')
    }

    const updatedPassword = await hasher(password);

    const resetUserCredentials = await User.findByIdAndUpdate(user._id, {
        password: updatedPassword
    });

    if (!resetUserCredentials) {
        res.status(500);
        throw new Error('Error updating password')
    } else {
        res.status(201).json( {
            token: generateToken(user._id)
        });
    }
});

// @desc    Delete user
// @route   DELETE /api/user/
// @access  Private

const deleteUser = asyncHandler(async (req, res) => {

    // Find user

    const user = await User.findById(req.user.id);

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('User does not exist')
    }

    const id = user._id;

    // Delete User Profile, User Boards, And User Tasks

    const deleteUserProfile = await User.findByIdAndDelete(id);
    const deleteUserBoards = await Board.deleteMany({ user: id });
    const deleteUserTasks = await Task.deleteMany({ user: id });

    if (!deleteUserProfile || !deleteUserBoards || !deleteUserTasks) {
        res.status(500);
        throw new Error('An error occured when deleting user')
    } else {
        res.status(200).json( {
            id
        });
    }
});


module.exports = { registerUser, loginUser, getUserData, verifyUser, resetUserPassword, deleteUser }