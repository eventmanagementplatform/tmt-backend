const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/add-project', createProject);
router.get('/', getAllProjects);
router.get('/:ProjectID', getProjectById);
router.put('/:ProjectID', updateProject);
router.delete('/:ProjectID', deleteProject);

module.exports = router;
