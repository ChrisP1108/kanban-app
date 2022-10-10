const express = require ('express');
const router = express.Router();
const { registerUser, loginUser, } = require('../controllers/userController')

router.post('/register', registerUser); // Register User

router.post('/login', loginUser); // LoginUser

module.exports = router;