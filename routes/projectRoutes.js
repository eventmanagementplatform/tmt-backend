const express = require('express');
const router = express.Router();
const { createProject, getAllProjects } = require('../controllers/projectController');

router.post('/add-project', createProject);
router.get('/', getAllProjects);

module.exports = router;
