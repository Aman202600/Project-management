const express = require('express');
const { body } = require('express-validator');
const {
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

router.route('/:id')
  .put(
    body('title').optional().notEmpty().withMessage('Task title cannot be empty').trim().escape(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('due_date').optional().isISO8601().toDate().withMessage('Invalid date format'),
    updateTask
  )
  .delete(deleteTask);

module.exports = router;
