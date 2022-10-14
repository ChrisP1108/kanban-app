const asyncHandler = require('express-async-handler');

const Board = require('../models/boardModel');
const Task = require ('../models/taskModel');

// @desc    Add task
// @route   POST /api/tasks
// @access  Private

const addTask = asyncHandler(async (req, res) => {
    const { title, description, subtasks, status, boardId } = req.body;

    // Check for empty fields

    if (!title) {
        res.status(400);
        throw new Error('Please add a task title')
    }
    if (!description) {
        res.status(400);
        throw new Error('Please add a task description')
    }
    if (!subtasks || !subtasks.length || typeof subtasks !== 'object')  {
        res.status(400);
        throw new Error('Please add at least one subtask')
    }
    if (!status) {
        res.status(400);
        throw new Error('Please add a task status')
    }
    if (!boardId) {
        res.status(400);
        throw new Error('Corresponding board ID must be provided')
    }

    // Check If Board For Task Exists

    const checkBoard = await Board.findById(boardId)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Board Not Found Or Invalid Board ID')
    }

    // Check If Board For Task Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User Not Authorized')
    }

    // Create task

    const createTask = await Task.create({
        title,
        description,
        subtasks,
        status,
        board: boardId,
        user: req.user._id
    });

    if (!createTask) {
        res.status(500);
        throw new Error('Error Saving Task Data To MongoDB')
    } else res.status(201).json({ id: createTask._id })

});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, subtasks, status } = req.body;

    // Check for empty fields

    if (!title) {
        res.status(400);
        throw new Error('Please add a task title')
    }
    if (!description) {
        res.status(400);
        throw new Error('Please add a task description')
    }
    if (!subtasks || !subtasks.length || typeof subtasks !== 'object')  {
        res.status(400);
        throw new Error('Please add at least one subtask')
    }
    if (!status) {
        res.status(400);
        throw new Error('Please add a task status')
    }

    // Check If Task Exists

    const checkTask = await Task.findById(req.params.id)

    if (!checkTask) {
        res.status(400);
        throw new Error('Task Not Found Or Invalid Task ID')
    }

    // Check If Task Corresponds To User

    if (checkTask.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User Not Authorized')
    }

    // Update Task

    const updateTask = await Task.findByIdAndUpdate(req.params.id, {
        title, description, subtasks, status
    });

    if (!updateTask) {
        res.status(500);
        throw new Error('Error Updating Task Data To MongoDB')
    } else res.status(200).json({ id: updateTask._id })
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private

const deleteTask = asyncHandler(async (req, res) => {

    // Check If Task Exists

    const checkTask = await Task.findById(req.params.id)

    if (!checkTask) {
        res.status(400);
        throw new Error('Task Not Found Or Invalid Task ID')
    }

    // Check If Task Corresponds To User

    if (checkTask.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User Not Authorized')
    }

    // Delete Task

    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
        res.status(500);
        throw new Error('Error Deleting Task Data From MongoDB')
    } else res.status(200).json({ id: deleteTask._id })
});

module.exports = { addTask, updateTask, deleteTask }