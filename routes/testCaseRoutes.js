const express = require('express');
const router = express.Router();
const { addTestCase, getTestCasesByRun } = require('../controllers/testCaseController');

router.post('/add-testcase', addTestCase);
router.get('/:RunID', getTestCasesByRun);

module.exports = router;
