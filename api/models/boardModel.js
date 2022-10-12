const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a board name']
    },
    columns: [{
        type: String,
        required: [true, 'Please add at least one column']
    }], 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Board', boardSchema)