const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    if (token) {  
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

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

module.exports = { protect }