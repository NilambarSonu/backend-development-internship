const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDeletedTasks,
  restoreTask,
  permanentlyDeleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 */

/**
 * @swagger
 * /api/v1/tasks/deleted:
 *   get:
 *     summary: Get all deleted tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted tasks
 */
router.get('/deleted', protect, getDeletedTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}/restore:
 *   put:
 *     summary: Restore a deleted task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task restored
 */
router.put('/:id/restore', protect, restoreTask);

/**
 * @swagger
 * /api/v1/tasks/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task permanently deleted
 */
router.delete('/:id/permanent', protect, permanentlyDeleteTask);

router
  .route('/')
  .get(protect, getTasks)
  .post(
    protect,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
    ],
    createTask
  );

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

// Admin-only route example
router.get('/admin/all', protect, authorize('admin'), getTasks);

module.exports = router;
