const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  deleteProject
} = require('../controllers/projectController');
const { addTask, getTasks } = require('../controllers/taskController');

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(
    body('name').notEmpty().withMessage('Project name is required').trim().escape(),
    body('description').optional().trim().escape(),
    createProject
  );

router.route('/:id')
  .get(getProject)
  .delete(deleteProject);

// Tasks sub-routes
router.route('/:project_id/tasks')
  .get(getTasks)
  .post(
    body('title').notEmpty().withMessage('Task title is required').trim().escape(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('due_date').optional().isISO8601().toDate().withMessage('Invalid date format'),
    addTask
  );

module.exports = router;
