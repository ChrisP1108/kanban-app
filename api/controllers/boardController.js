const asyncHandler = require('express-async-handler');

const Board = require('../models/boardModel');
const Task = require ('../models/taskModel');

const { caseFormatAll } = require('../services/caseFormatting');

// @desc    Get boards
// @route   GET /api/boards
// @access  Private

const getBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find({ user: req.user._id });

    if (!boards) {
        res.status(500);
        throw new Error('Error getting boards from MongoDB')
    }

    if (!boards.length) {
        res.status(200).json([])
    } else {
        const boardsData = [];
        for(board of boards) {
            boardsData.push({ name: board.name, columns: board.columns, 
                id: board._id, tasks: await Task.find({ board: board._id }) })
        }
        res.status(200).json(boardsData)
    }
});

// @desc    Add board
// @route   POST /api/boards
// @access  Private

const addBoard = asyncHandler(async (req, res) => {
    let { name, columns } = req.body

    // Check for empty fields.  Column field is optional.

    if (!name) {
        res.status(400);
        throw new Error('Please add a board name')
    }

    // Check for duplicate columns

    if (columns.some(column => columns.filter(col => col === column).length > 1)) {
        res.status(400);
        throw new Error('Duplicate column names not allowed')
    } 

    // Check if duplicate board name exists

    const checkBoards = await Board.find( { user: req.user._id });

    if (checkBoards.some(board => board.name.toLowerCase() === name.toLowerCase())) {
        res.status(400);
        throw new Error('Board with duplicate name already exists')
    }

    // Capitalize First Characters Of Names And Columns

    name = caseFormatAll(name);

    if (columns.length && columns[0] !== '') {
        columns = columns.map(column => caseFormatAll(column));
    }

    if (!columns || columns[0] === '') {
        columns = [];
    }

    // Create board

    const createBoard = await Board.create({ name, columns, user: req.user._id  })

    if (!createBoard) {
        res.status(500);
        throw new Error('Error saving board data to MongoDB')
    } else res.status(201).json({ _id: createBoard._id })
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private

const updateBoard = asyncHandler(async (req, res) => {
    let { name, columns } = req.body;

    // Check if Req Params has an ID

    if (!req.params.id) {
        res.status(400);
        throw new Error('Please provide the board ID in url parameters')
    }

    // Check for empty fields.  Columns Optional

    if (!name) {
        res.status(400);
        throw new Error('Please add a board name')
    }

    // Check If Board Exists

    const checkBoard = await Board.findById(req.params.id)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Board not found or invalid board ID')
    }

    // Check If Board Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // If Existing Task Column Is Being Removed Or Changed, Make Sure None Of The Board Tasks Have Their Status Still Set To It

    const boardTasks = await Task.find({ board: checkBoard._id.toString() })
    if (boardTasks.length) {
        if (!boardTasks.some(task => columns.includes(task.status))) {
            res.status(400);
            throw new Error('Cannot edit/delete columns that have tasks with previous column value still set as its status')
        }
    }

    // Capitalize First Characters Of Names And Columns

    name = caseFormatAll(name);
    
    if (columns.length && columns[0] !== '') {
        columns = columns.map(column => caseFormatAll(column));
    }

    if (!columns || columns[0] === '') {
        columns = [];
    }

    // Update Board

    const updateBoard = await Board.findByIdAndUpdate(req.params.id, { name, columns });

    if (!updateBoard) {
        res.status(500);
        throw new Error('Error updating board to MongoDB')
    } else res.status(200).json({ _id: updateBoard._id })
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private

const deleteBoard = asyncHandler(async (req, res) => {

    // Check If Board Exists

    const checkBoard = await Board.findById(req.params.id)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Board not found or invalid board ID')
    }

    // Check If Board Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Check If Board Has Tasks

    const checkTasks = await Task.find({ board: req.params.id });

    // Delete Corresponding Board Tasks If Tasks Found

    if (checkTasks.length) {
        const boardTasks = await Task.deleteMany({ board: req.params.id })
        if (!boardTasks) {
            res.status(500);
            throw new Error('Error deleting corresponding tasks to MongoDB')
        }
    }

    // Delete Board

    const deleteBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deleteBoard) {
        res.status(500);
        throw new Error('Error deleting board to MongoDB')
    } else res.status(200).json({ _id: deleteBoard._id })
});

module.exports = { getBoards, addBoard, updateBoard, deleteBoard }