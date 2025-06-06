const express = require('express');
const router = express.Router();
const { addRun, getRunsByRelease } = require('../controllers/runController');

router.post('/add-run', addRun);
router.get('/:ProjectID/:ReleaseID', getRunsByRelease);

module.exports = router;
