const asyncHandler = require('express-async-handler');

const Board = require('../models/boardModel');
const Task = require ('../models/taskModel');

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
    const { name, columns } = req.body

    // Check for empty fields

    if (!name) {
        res.status(400);
        throw new Error('Please add a board name')
    }
    if (!columns || !columns.length || typeof columns !== 'object') {
        res.status(400);
        throw new Error('Please add at least one board column')
    }

    // Create board

    const createBoard = await Board.create({ name, columns, user: req.user._id  })

    if (!createBoard) {
        res.status(500);
        throw new Error('Error saving board data to MongoDB')
    } else res.status(201).json({ id: createBoard._id })
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private

const updateBoard = asyncHandler(async (req, res) => {
    const { name, columns } = req.body;

    // Check for empty fields

    if (!name) {
        res.status(400);
        throw new Error('Please add a board name')
    }
    if (!columns || !columns.length || typeof columns !== 'object') {
        res.status(400);
        throw new Error('Please add at least one board column')
    }

    // Check If Board Exists

    const checkBoard = await Board.findById(req.params.id)

    console.log(checkBoard)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Board not found or invalid board ID')
    }

    // Check If Board Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized')
    }

    // Update Board

    const updateBoard = await Board.findByIdAndUpdate(req.params.id, { name, columns });

    if (!updateBoard) {
        res.status(500);
        throw new Error('Error updating board to MongoDB')
    } else res.status(200).json({ id: updateBoard._id })
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

    // Delete Board

    const deleteBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deleteBoard) {
        res.status(500);
        throw new Error('Error deleting board to MongoDB')
    } else res.status(200).json({ id: deleteBoard._id })
});

module.exports = { getBoards, addBoard, updateBoard, deleteBoard }