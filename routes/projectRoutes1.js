const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController1');

router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.post('/add-release', projectController.addRelease);
router.post('/add-run', projectController.addRun);

module.exports = router;
