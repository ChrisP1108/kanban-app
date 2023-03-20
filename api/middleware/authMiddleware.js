const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Decode JWT

function decodeJWT(input) {
    return jwt.verify(input, process.env.JWT_SECRET)
}

// Protect Routes That Require Users To Already Be Logged In

const protect = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    if (token) {  
        try {
            const decodedToken = decodeJWT(token);

            // Get user from decoded token ID

            const user = await User.findById(decodedToken.id);

            if (!user) {
                res.status(401);
                throw new Error('Token provided does not correspond to a user.')
            }

            // Set user data to req.user

            req.user = user;

            next();
        } catch (err) {
            res.status(401);
            throw new Error('User not authorized')
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token')
    }
});

// Verify User Email

const validate = asyncHandler(async (req, res, next) => {
    const { key, email } = req.body;

    // Check That Key Exists In Body. If Not, Throw Error

    if (!key) {
        res.status(401);
        throw new Error('Not authorized, no email validation key parameter provided')
    }

    // Check For Browser Cookie

    if (req.cookies.key) {

        // Decode JWT

        const decodedToken = JSON.parse(decodeJWT(req.cookies.key).key);

        // If No Key, Time, Or Email Found In Decoded JWT, Throw Error

        if (!decodedToken.key || !decodedToken.time || !decodedToken.email) {
            res.status(401);
            res.clearCookie("key");
            throw new Error('Not authorized, invalid validation key cookie')
        }

        // Check That Emails Match

        if (decodedToken.email !== email.toLowerCase()) {
            res.status(401);
            throw new Error('Not authorized, invalid email provided')
        }

        // Check That Time Interval Is Not Greater Than 300000ms

        if (Date.now() - Number(decodedToken.time) > 300000) {
            res.status(401);
            throw new Error('Not authorized, cookie expired')
        }

        // Check That User Input Key Matches 

        if (!await bcrypt.compare(key, decodedToken.key)) {
            res.status(401);
            throw new Error('Not authorized, invalid key')
        }

        next();

    } else {

        // No Key Cookie Found.  Throw Error

        res.status(401);
        throw new Error('Not authorized, no email validation key cookie')
    }
});

module.exports = { protect, validate }