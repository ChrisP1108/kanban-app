const express = require ('express');
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController')

router.get('/', getTasks); // Get Tasks

router.post('/', addTask); // Add Task

router.put('/:id', updateTask); // Update Task

router.delete('/:id', deleteTask); // Delete Task

module.exports = router;