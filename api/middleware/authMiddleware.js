const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {  
        try {
            // Get token from header

            const token = authorization.split(' ')[1];

            // Decrypt token

            const decryptedToken = cryptr.decrypt(token);

            // Verify token

            const decodedToken = jwt.verify(decryptedToken, process.env.JWT_SECRET);

            // Get user from decoded token ID

            const user = await User.findById(decodedToken.id);

            // Set user Id to req.user.id

            req.user.id = user._id;

            next()
        } catch (err) {
            console.error(err);
            res.status(401);
            throw new Error('User not authorized')
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token')
    }
});

module.exports = { protect }