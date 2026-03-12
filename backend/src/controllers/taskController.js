const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Add task to project
// @route   POST /projects/:project_id/tasks
// @access  Public
exports.addTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    req.body.project_id = req.params.project_id;

    const project = await Project.findById(req.params.project_id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `No project with the id of ${req.params.project_id}`
      });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get tasks for project
// @route   GET /projects/:project_id/tasks
// @access  Public
exports.getTasks = async (req, res, next) => {
  try {
    const query = { project_id: req.params.project_id };

    // Filtering by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Task.countDocuments(query);

    // Sorting
    let sortBy = { created_at: -1 };
    if (req.query.sort === 'due_date') {
        sortBy = { due_date: 1 };
    }

    const tasks = await Task.find(query)
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pagination,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /tasks/:id
// @access  Public
exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `No task found with id of ${req.params.id}`
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Public
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `No task found with id of ${req.params.id}`
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
