const asyncHandler = require('express-async-handler');

const Board = require('../models/boardModel');
const Task = require ('../models/taskModel');

const { caseFormatAll, caseFormatFirst } = require('../services/caseFormatting');

// @desc    Add task
// @route   POST /api/tasks
// @access  Private

const addTask = asyncHandler(async (req, res) => {
    let { title, description, subtasks, status } = req.body;

    const { boardId } = req.body;

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

    if (!subtasks[0].name|| typeof !subtasks[0].checked !== 'boolean') {
        res.status(400);
        throw new Error('Please make sure subtasks are formatted with { name: ###, checked: false }')
    }

    if (!status) {
        res.status(400);
        throw new Error('Please add a task status')
    }
    if (!boardId) {
        res.status(400);
        throw new Error('Corresponding board ID must be provided')
    }

    // Check If Two Subtasks Of The Same Name Are Being Added

    const subtaskInputNames = subtasks.map(subtask => subtask.name).sort();

    if (subtaskInputNames.some((name, index) => name === subtaskInputNames[index + 1])) {
        res.status(400);
        throw new Error('Cannot have two subtasks with the same name')
    }

    // Check If Board For Task Exists

    const checkBoard = await Board.findById(boardId)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Corresponding board not found or invalid board ID')
    }

    // Check If Board For Task Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Check if duplicate task name exists inside same board

    const checkTasks = await Task.find( { board: checkBoard._id.toString() });

    if (checkTasks.some(task => task.title.toLowerCase() === title.toLowerCase())) {
        res.status(400);
        throw new Error('Task with duplicate title in the same board already exists')
    }

    // Check if duplicate subtask name exists inside same task

    const subtaskNamesCheck = [];

    checkTasks.forEach(task => {
        task.subtasks.forEach(subtask => {
            subtaskNamesCheck.push(subtask.name.toLowerCase())
        });
    });

    if (subtasks.some(subtask => subtaskNamesCheck.includes(subtask.name))) {
        res.status(400);
        throw new Error('Subtask with duplicate name exists in same task')
    }

    // Check that status value is an actual board column value

    if (!checkBoard.columns.includes(status)) {
        res.status(400);
        throw new Error('Task status value does not equate to one of its corresponding board column values')
    }

    // Capitalize First Characters Of Title Letters

    title = caseFormatAll(title);

    // Capitalize First Character Of Description

    description = caseFormatFirst(description);

    // Capitalize First Character Of Each Subtask
    
    subtasks = subtasks.map(subtask => ({ name: caseFormatFirst(subtask.name), checked: false }));

    // Capitalize First Character Of Each Subtask
    
    status = caseFormatFirst(status);

    // Create task

    const createTask = await Task.create({
        title,
        description,
        subtasks,
        status,
        board: checkBoard._id,
        user: req.user._id
    });

    if (!createTask) {
        res.status(500);
        throw new Error('Error saving task data to MongoDB')
    } else res.status(201).json({ _id: createTask._id, subtasks: createTask.subtasks })

});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private

const updateTask = asyncHandler(async (req, res) => {
    let { title, description, subtasks, status } = req.body;

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
        throw new Error('Task not found or invalid task iD')
    }

    // Check If Task Corresponds To User

    if (checkTask.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Capitalize First Characters Of Title Letters

    title = caseFormatAll(title);

    // Capitalize First Character Of Description

    description = caseFormatFirst(description);

    // Capitalize First Character Of Each Subtask
    
    subtasks = subtasks.map(subtask => ({ name: caseFormatFirst(subtask.name), checked: subtask.checked }));

    // Capitalize First Character Of Status
    
    status = caseFormatFirst(status);

    // Update Task

    const updateTask = await Task.findByIdAndUpdate(req.params.id, {
        title, description, subtasks, status, board: checkTask.board, user: checkTask.user
    });

    // Check for error updating task

    if (!updateTask) {
        res.status(500);
        throw new Error('Error updating task data to MongoDB')
    }

    // Load updated task to return subtasks to UI 

    const updatedTask = await Task.findById(req.params.id);

    res.status(200).json({ _id: updateTask._id, subtasks: updatedTask.subtasks })
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private

const deleteTask = asyncHandler(async (req, res) => {

    // Check If Task Exists

    const checkTask = await Task.findById(req.params.id)

    if (!checkTask) {
        res.status(400);
        throw new Error('Task not found or invalid task ID')
    }

    // Check If Task Corresponds To User

    if (checkTask.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Delete Task

    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
        res.status(500);
        throw new Error('Error deleting task data from MongoDB')
    } else res.status(200).json({ _id: deleteTask._id })
});

// @desc    Toggle Subtask Checked
// @route   PUT api/tasks/:id/subtasks/
// @access  Private

const toggleCheckedSubtasks = asyncHandler(async (req, res) => {
    const { subtasks } = req.body;

    // Check If Checked Variable In Body Is A Boolean

    if (typeof subtasks !== 'object' || subtasks.length < 1) {
        res.status(400);
        throw new Error('Subtasks must be an array')
    }

    if (!subtasks.every(subtask => subtask._id)) {
        res.status(400);
        throw new Error('Subtasks must have an _id key and value')
    }

    if (!subtasks.every(subtask => subtask.name || typeof subtask.name === 'string')) {
        res.status(400);
        throw new Error('Subtasks must have a name key and string value')
    }

    if (!subtasks.every(subtask => subtask.checked === true || subtask.checked === false)) {
        res.status(400);
        throw new Error('Subtasks must have a name key and boolean value')
    }

    // Check If Parent Task Exists From Id Parameter

    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('No task with such id exists')
    }

    // Check If Task Corresponds To User

    if (task.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Update Subtask Checked Value

    // Update Checked Boolean Value Of SubTask By Updating Entire Task

    const updateSubtasks = await Task.findByIdAndUpdate(task._id, {
        subtasks
    });

    if (!updateSubtasks) {
        res.status(500);
        throw new Error('Error updating subtask to MongoDB')
    } else res.status(200).json({ _id: updateSubtasks._id })
});

// @desc    Update Task Status
// @route   PUT api/tasks/:id/status
// @access  Private

const updateTaskStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Check If Checked Variable In Body Is A Boolean

    if (typeof status !== 'string') {
        res.status(400);
        throw new Error('Status parameter must be a string')
    }

    // Check If Parent Task Exists From Id Parameter

    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(400);
        throw new Error('No task with such id exists')
    }

    // Check If Task Corresponds To User

    if (task.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Check If Status Corresponds To A Board Column Value

    const board = await Board.findById(task.board)

    if (!board.columns.includes(status)) {
        res.status(400);
        throw new Error('No column value for task board corresponds to status value')
    }

    // Update Task Status

    const updateTaskStatus= await Task.findByIdAndUpdate(task._id, {
        status
    });

    if (!updateTaskStatus) {
        res.status(500);
        throw new Error('Error updating subtask to MongoDB')
    } else res.status(200).json({ _id: updateTaskStatus._id })
})

module.exports = { addTask, updateTask, deleteTask, toggleCheckedSubtasks, updateTaskStatus }