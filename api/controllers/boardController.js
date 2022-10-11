const asyncHandler = require('express-async-handler');

const Board = require('../models/boardModel');

// @desc    Get boards
// @route   GET /api/boards
// @access  Private

const getBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find()
    res.status(200).json(boards)
});

// @desc    Add board
// @route   POST /api/boards
// @access  Private

const addBoard = asyncHandler(async (req, res) => {
    const { name, columns } = req.body
    if(!name) {
        res.status(400);
        throw new Error('Please Add A Board Name')
    }
    if(!columns || !columns.length || typeof columns !== 'object') {
        res.status(400);
        throw new Error('Please Add At Least One Board Column')
    }
    res.status(201).json(req.body)
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private

const updateBoard = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update Board ${req.params.id}` })
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private

const deleteBoard = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete Board ${req.params.id}` })
});

module.exports = { getBoards, addBoard, updateBoard, deleteBoard }