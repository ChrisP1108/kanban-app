const express = require ('express');
const router = express.Router();
const { addBoard, addBoardColumn, updateBoard, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addBoard); // Add Board (Protected)

router.put('/:id/column', protect, addBoardColumn); // Add Board Column (Protected)

router.put('/:id', protect, updateBoard); // Update Board (Protected)

router.delete('/:id', protect, deleteBoard); // Delete Board (Protected)

module.exports = router;