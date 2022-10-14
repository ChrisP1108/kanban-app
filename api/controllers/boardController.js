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
        throw new Error('Error Getting Boards From MongoDB')
    }

    if (!boards.length) {
        res.status(200).json([])
    } else {
        const boardsData = boards.map(async board => {
            return { name: board.name, columns: board.columns, 
                tasks: await Task.find({ board: board._id })
            }
        });
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
        throw new Error('Please Add A Board Name')
    }
    if (!columns || !columns.length || typeof columns !== 'object') {
        res.status(400);
        throw new Error('Please Add At Least One Board Column')
    }

    // Create board

    const createBoard = await Board.create({ name, columns, user: req.user._id  })

    if (!createBoard) {
        res.status(500);
        throw new Error('Error Saving Board Data To MongoDB')
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
        throw new Error('Please Add A Board Name')
    }
    if (!columns || !columns.length || typeof columns !== 'object') {
        res.status(400);
        throw new Error('Please Add At Least One Board Column')
    }

    // Check If Board Exists

    const checkBoard = await Board.findById(req.params.id)

    if (!checkBoard) {
        res.status(400);
        throw new Error('Board Not Found Or Invalid Board ID')
    }

    // Check If Board Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User Not Authorized')
    }

    // Update Board

    const updateBoard = await Board.findByIdAndUpdate(req.params.id, { name, columns });

    if (!updateBoard) {
        res.status(500);
        throw new Error('Error Updating Board To MongoDB')
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
        throw new Error('Board Not Found Or Invalid Board ID')
    }

    // Check If Board Corresponds To User

    if (checkBoard.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User Not Authorized')
    }

    // Delete Board

    const deleteBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deleteBoard) {
        res.status(500);
        throw new Error('Error Deleting Board To MongoDB')
    } else res.status(200).json({ id: deleteBoard._id })
});

module.exports = { getBoards, addBoard, updateBoard, deleteBoard }