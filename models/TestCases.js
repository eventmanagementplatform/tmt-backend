const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  TestCaseID: { type: String, required: true, unique: true },
  TestCaseName: { type: String, required: true },
  RunID: { type: String, required: true },
  step: { type: String, required: true },
  expected: { type: String, required: true },
  actual: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PASS', 'FAIL', 'BLOCKED', 'NOT RUN'],
    default: 'NOT RUN'
  },
  actions: {
    type: String,
    enum: ['LAUNCHBROWSER', 'CLICK', 'ENTERTEXT', 'SELECTDROPDOWN', 'VERIFYTEXT', 'NAVIGATETO'],
    required: true
  }
});

module.exports = mongoose.model('TestCase', testCaseSchema);
