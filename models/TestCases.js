const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  ProjectID: { type: String, required: true, ref: 'Project' },
  ReleaseID: { type: String, required: true, ref: 'Release' },
  RunID: { type: String, required: true },
  TestCaseID: { type: String, required: true, unique: true },
  TestCaseName: { type: String, required: true },
  
});
testCaseSchema.index({ ProjectID: 1,ReleaseID: 1, RunID: 1, TestCaseName: 1 }, { unique: true }); // Unique per run
module.exports = mongoose.model('TestCase', testCaseSchema);
