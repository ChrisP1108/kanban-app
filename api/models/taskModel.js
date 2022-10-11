const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task name']
    },
    description: {
        type: String,
        required: [true, 'Please add a task description']
    }, 
    subtasks: [{
        type: String,
        required: [true, 'Please add at least one subtask']
    }],
    status: {
        type: String,
        required: [true, 'Please select task status']
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema)