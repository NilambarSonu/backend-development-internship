const prisma = require('../config/prisma');
const { validationResult } = require('express-validator');

// @desc    Get all tasks (excluding deleted)
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { 
        userId: req.user.id,
        deletedAt: null
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { name: true, email: true } } }
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task
    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }

  const { title, description } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id
      }
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array()[0].msg));
  }

  try {
    let task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task
    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
      }
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task
    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await prisma.task.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() }
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deleted tasks
// @route   GET /api/v1/tasks/deleted
// @access  Private
const getDeletedTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { 
        userId: req.user.id,
        deletedAt: { not: null }
      },
      orderBy: { deletedAt: 'desc' }
    });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore deleted task
// @route   PUT /api/v1/tasks/:id/restore
// @access  Private
const restoreTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to restore this task');
    }

    const restoredTask = await prisma.task.update({
      where: { id: req.params.id },
      data: { deletedAt: null }
    });

    res.status(200).json({ success: true, data: restoredTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete task
// @route   DELETE /api/v1/tasks/:id/permanent
// @access  Private
const permanentlyDeleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await prisma.task.delete({ where: { id: req.params.id } });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDeletedTasks,
  restoreTask,
  permanentlyDeleteTask
};
