const express = require('express');
const router = express.Router();
const {
  getTasks, getTask, createTask, updateTask, deleteTask,
} = require('../../controllers/task/taskController');
const { protect } = require('../../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;