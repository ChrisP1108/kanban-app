const express = require ('express');
const router = express.Router();
const { registerUser, loginUser, getUserData, verifyUser, 
    resetUserPassword, deleteUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser); // Register User

router.post('/login', loginUser); // LoginUser

router.get('/data', protect, getUserData); // Get User Data (Protected)

router.post('/verify', protect, verifyUser); // Verify User (Protected)

router.post('/reset', resetUserPassword); // Reset Password 

router.delete('/', protect, deleteUser) // Delete User (Protected)

module.exports = router;