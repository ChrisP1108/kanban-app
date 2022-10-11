const express = require ('express');
const router = express.Router();
const { registerUser, loginUser, getUserData, verifyUser, 
    resetUserPassword } = require('../controllers/userController')

router.post('/register', registerUser); // Register User

router.post('/login', loginUser); // LoginUser

router.get('/data', getUserData); // Get User Data 

router.post('/verify', verifyUser); // Verify User

router.post('/reset', resetUserPassword); // Reset Password

module.exports = router;