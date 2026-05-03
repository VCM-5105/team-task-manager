const express = require('express');
const router = express.Router();

const { 
    createTask, 
    getTasksByProject, 
    updateTaskStatus 
} = require('../controllers/taskController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ Get tasks by project
router.get('/project/:projectId', protect, getTasksByProject);

// ✅ Create task (Admin only)
router.post('/', protect, authorize('Admin'), createTask);

// ✅ Update task status (clear endpoint)
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;