const express = require ('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserData, verifyUser, 
    resetUserPassword, deleteUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser); // Register User

router.post('/login', loginUser); // Login User

router.post('/logout', protect, logoutUser) // Logout User

router.get('/data', protect, getUserData); // Get User Data (Protected)

router.post('/verify', verifyUser); // Verify User

router.post('/reset', resetUserPassword); // Reset Password 

router.post('/', protect, deleteUser) // Delete User (Protected)

module.exports = router;