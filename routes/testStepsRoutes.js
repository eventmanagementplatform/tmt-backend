const express = require('express');
const router = express.Router();

// ✅ Make sure this path is correct and not a typo
const {
  createTestCaseWithSteps,
  getTestCaseByTestCaseID,
  getAllTestCases
} = require('../controllers/testStepsController');

// ✅ Use handlers correctly
router.post('/add-steps', createTestCaseWithSteps);
router.get('/:TestCaseID', getTestCaseByTestCaseID);
router.get('/', getAllTestCases);

module.exports = router;
