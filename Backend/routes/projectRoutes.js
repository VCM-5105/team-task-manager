const express = require('express');
const router = express.Router();

const { 
    createProject, 
    getAllProjects, 
    getProjectById 
} = require('../controllers/projectController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ GET all projects
router.get('/', protect, getAllProjects);

// ✅ GET single project
router.get('/:id', protect, getProjectById);

// ✅ CREATE project (Admin only)
router.post('/', protect, authorize('Admin'), createProject);

module.exports = router;