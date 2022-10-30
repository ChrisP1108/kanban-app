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

    if (!subtasks[0].name || typeof !subtasks[0].checked !== 'boolean') {
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
    } else res.status(201).json({ _id: createTask._id })

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

    description = caseFormatFirst(columns);

    // Capitalize First Character Of Each Subtask
    
    subtasks = subtasks.map(subtask => caseFormatAll(subtask));

    // Capitalize First Character Of Each Subtask
    
    status = caseFormatFirst(status);

    // Update Task

    const updateTask = await Task.findByIdAndUpdate(req.params.id, {
        title, description, subtasks, status
    });

    if (!updateTask) {
        res.status(500);
        throw new Error('Error updating task data to MongoDB')
    } else res.status(200).json({ _id: updateTask._id })
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
// @route   PUT /:taskid/subtasks/:subtaskid
// @access  Private

const toggleCheckedSubtask = asyncHandler(async (req, res) => {
    const { checked } = req.body;

    // Check If Checked Variable In Body Is A Boolean

    if (typeof checked !== 'boolean') {
        res.status(400);
        throw new Error('Checked parameter must be a boolean')
    }

    // Check If Parent Task Exists From Id Parameter

    const task = await Task.findById(req.params.taskId);

    if (!task) {
        res.status(400);
        throw new Error('No task with such id exists')
    }

    // Check If Parent Task Corresponds To User

    if (task.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Check If Subtask Exists In Task From Id Parameter

    if (!task.subtasks.some(subtask => subtask._id === req.params.subtaskId)) {
        res.status(400);
        throw new Error('No subtask with such id exists in task')
    }

    // Update Subtask Checked Value

    const subtasksUpdate = task.subtasks.map(subtask => 
        subtask._id === req.params.subtaskId ? {...subtask, checked } : subtask
    )

    // Update Checked Boolean Value Of SubTask By Updating Entire Task

    const toggleSubtaskChecked = await Task.findByIdAndUpdate(task._id, {
        subtasks: subtasksUpdate
    });

    if (!toggleSubtaskChecked) {
        res.status(500);
        throw new Error('Error updating subtask to MongoDB')
    } else res.status(200).json({ _id: toggleSubtaskChecked })
    
})

module.exports = { addTask, updateTask, deleteTask, toggleCheckedSubtask }