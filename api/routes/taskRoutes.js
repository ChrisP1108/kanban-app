const express = require ('express');
const router = express.Router();
const { addTask, updateTask, deleteTask, 
    toggleCheckedSubtasks, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addTask); // Add Task (Protected)

router.put('/:id', protect, updateTask); // Update Task (Protected)

router.delete('/:id', protect, deleteTask); // Delete Task (Protected)

router.put('/:id/subtasks', protect, toggleCheckedSubtasks); // Toggle Subtask Checked (Protected)

router.put('/:id/status', protect, updateTaskStatus); // Update Task Status (Protected)

module.exports = router;