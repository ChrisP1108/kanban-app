const express = require ('express');
const router = express.Router();
const { getBoards, addBoard, updateBoard, deleteBoard } = require('../controllers/boardController')

router.get('/', getBoards); // Get Boards

router.post('/', addBoard); // Add Board

router.put('/:id', updateBoard); // Update Board

router.delete('/:id', deleteBoard); // Delete Board

module.exports = router;