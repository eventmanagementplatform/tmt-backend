const express = require('express');
const router = express.Router();
const { addRelease, getReleasesByProject } = require('../controllers/releaseController');

router.post('/add-release', addRelease);
router.get('/:ProjectID', getReleasesByProject);

module.exports = router;
