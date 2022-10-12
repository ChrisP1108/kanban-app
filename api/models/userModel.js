const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    pin: {
        type: String,
        required: [true, 'Please add a PIN'],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema)