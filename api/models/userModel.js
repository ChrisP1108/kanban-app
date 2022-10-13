const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please add a last name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    pin: {
        type: String,
        required: [true, 'Please add a PIN'],
    },
    security: {
        question: {
            type: String,
            required: [true, 'Please add a security question']
        },
        answer: {
            type: String,
            required: [true, 'Please add a security answer']
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema)