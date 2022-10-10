const asyncHandler = require('express-async-handler');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private

const getTasks = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Get Tasks' })
});

// @desc    Add task
// @route   POST /api/tasks
// @access  Private

const addTask = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Add Task' })
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private

const updateTask = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update Task ${req.params.id}` })
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private

const deleteTask = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete Task ${req.params.id}` })
});

module.exports = { getTasks, addTask, updateTask, deleteTask }