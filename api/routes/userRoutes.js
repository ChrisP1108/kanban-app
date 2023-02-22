const express = require ('express');
const router = express.Router();
const { validateUser, registerUser, loginUser, logoutUser, getUserData, 
    resetUserPassword, deleteUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

router.post('/validate', validateUser); // Validate User Email For Registration Or Password Reset

router.post('/register', registerUser); // Register User

router.post('/login', loginUser); // Login User

router.post('/logout', protect, logoutUser) // Logout User

router.get('/data', protect, getUserData); // Get User Data (Protected)

router.post('/reset', resetUserPassword); // Reset Password 

router.post('/delete', protect, deleteUser) // Delete User (Protected)

module.exports = router;