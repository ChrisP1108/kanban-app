const express = require ('express');
const router = express.Router();
const { addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addTask); // Add Task (Protected)

router.put('/:id', protect, updateTask); // Update Task (Protected)

router.delete('/:id', protect, deleteTask); // Delete Task (Protected)

router.put('/:taskId/subtasks/:subtaskId'); // Toggle Subtask Checked (Protected)

module.exports = router;