const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Board = require('../models/boardModel');
const Task = require('../models/taskModel');

// Generate JWT (encrypted)

function generateToken(input, validation) {
    if (!validation) {
        return jwt.sign({ id: input }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    } else {
        return jwt.sign({ key: input }, process.env.JWT_SECRET, {
            expiresIn: '300s'
        });
    }
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

// Generate JWT Email Validation Key 

async function generateValidationKey(keyChars, email) {
    const time = Date.now().toString();
    const hashedKey = await hasher(process.env.JWT_SECRET + keyChars + time);
    const hashedEmail = await hasher(email.toLowerCase());
    const stringified = JSON.stringify({
        key: hashedKey,
        email: hashedEmail,
        time
    });
    return generateToken(stringified, true);
}

// Verify Valid Email

function verifyValidEmail(email) {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return email.match(regex) !== null;
}

// @desc    Validate Email.  Ensure that user email is valid prior to registering or resetting password.  Send Email To User To Validate Key
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

    // Check that registering was passed in as a boolean

    if (typeof registering !== 'boolean' && typeof registering !== 'string') {
        res.status(400);
        throw new Error('Please pass in "registering" boolean variable as true or false')
    }

    // Check if user with same email exists if user is attempting to register.  If resetting password, check if email entered corresponds to a user.

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    
    if (registering && emailExists) {
        res.status(400);
        throw new Error('User email already exists.  Please enter another email')
    }

    if (!registering && !emailExists) {
        res.status(400);
        throw new Error('No such user email exists')
    }

    // Generate Random Six Characters Key For Email Verification

    const keyChars = Math.random().toString(36).substring(2).slice(0, 6).toLowerCase();

    // Port To Use For SMTP Depending On If In Development Or Production

    const isDev = process.env.NODE_ENV === 'development';

    const port = isDev ? process.env.GMAIL_SMTP_PORT_TLS : process.env.GMAIL_SMTP_PORT_SSL;

    try {

        // Establish Email Connection

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port, 
            secure: true, 
            auth: {
                user: process.env.GMAIL_USER_EMAIL, 
                pass: process.env.GMAIL_SMTP_APP_PASSWORD,
            },
        });

        // Send Email

        await transporter.sendMail({
            from: process.env.GMAIL_USER_EMAIL,
            to: email, 
            subject: registering ? "Register For Kanban" : "Recover Password For Kanban", // Subject line
            attachments: [{
                filename: "logo.png",
                path: isDev ? `${__dirname}../../../static/icon.png` : `https://kanban-app-frontendmentor.herokuapp.com/icon.png`,
                cid: "logo"
            }],
            html: `
                <table style="width: 100%; background: black; margin: 0; padding: 24px;">
                    <tbody>
                        <tr>
                            <td align="center">
                                <img src="cid:logo" style="width: 60px; padding-bottom: 16px; color: white;"/>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <p style="margin: 0; padding-bottom: 24px; font-size: 22px; font-weight: 700; color: white;">Hello From Kanban</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <p style="font-size: 16px; margin: 0; padding-bottom: 4px; color: white;">This is your key ${registering ? `to register` : `to reset your password`} </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <p style="font-size: 18px; margin: 0; margin: 0; color: white;"><strong>${keyChars}</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <p style="font-size: 13px; margin: 0; padding-top: 40px; color: white;">Please use the key to ${registering ? `register` : `recover your password`} for the Kanban App.</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `
        });

    } catch(err) {
        res.status(500);
        throw new Error(`${err}. Couldn't send email to user.`)
    } 

    // Generate JWT Token For Cookie 

    const key = await generateValidationKey(keyChars, email);

    res.cookie("key", key, cookieOptions(300000));

    // Send Success Response

    res.status(200).json({ message: 'Temporary Number Key Generated And Emailed To User For Verification' });
});


// @desc    Finish Register user
// @route   POST /api/user/register
// @access  Private

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, password2 } = req.body;

    // Check For Empty Or Invalid Fields

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

    // Verifies if demo account is being used or not

    const demoAccount = email === process.env.GMAIL_USER_DEMO_EMAIL && password === process.env.GMAIL_USER_DEMO_PASSWORD; 

    const emailSearch = demoAccount ? process.env.GMAIL_USER_EMAIL.toLowerCase() : email.toLowerCase();
    
    // Find user

    const user = await User.findOne({ email: emailSearch  });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('User email does not exist')
    }

    // Check password if not demo account

    if (!demoAccount && !await bcrypt.compare(password.toLowerCase(), cryptr.decrypt(user.password))) {
        res.status(401);
        throw new Error('Invalid password')
    } else if (!demoAccount) {
        res.cookie("token", generateToken(user._id), cookieOptions(null));
        res.status(200).json({ message: 'User successfully logged In'});
    } else if (demoAccount) {
        res.status(200).json({ message: 'Demo Account Login Successful'});
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

// @desc    Get demo user data
// @route   GET /api/user/demo
// @access  Public

const getDemoData = asyncHandler(async (req, res) => {

    // Get demo boards from demo account

    const demoAccount = await User.findOne({ email: process.env.GMAIL_USER_EMAIL })

    const demoBoards = await Board.find({ user: demoAccount._id })

    const demoData = {
        user: {
            email: process.env.GMAIL_USER_DEMO_EMAIL,
            _id: demoAccount._id,
            createdAt: demoAccount.createdAt,
            updatedAt: demoAccount.updatedAt,
            __v: demoAccount.__v
        },
        boards: []
    }

    // Check if user has any boards saved

    if (!demoBoards.length) {
        res.status(200).json(demoData);
    } else {
    
        // Map tasks pertaining to each board if boards found for user

        for (board of demoBoards) {
            demoData.boards.push({ name: board.name, columns: board.columns, 
                _id: board._id, user: board.user, createdAt: board.createdAt,
                updatedAt: board.updatedAt, __v: board.__v,
                tasks: await Task.find({ board: board._id }) })
        }

        res.status(200).json(demoData)
    }
});

// @desc    Reset User Password
// @route   POST /api/user/reset
// @access  Private

const resetUserPassword = asyncHandler(async (req, res) => {
    const { email, password, password2 } = req.body;

    // Check For Empty Or Invalid Fields

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

    // Find user

    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists

    if (!user) {
        res.status(401);
        throw new Error('No user with corresponding email exists.')
    }

    // Update User Password

    const updatedPassword = await hasher(password.toLowerCase());

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
    logoutUser, getUserData, getDemoData, resetUserPassword, deleteUser 
}