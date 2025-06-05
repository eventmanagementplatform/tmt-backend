const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  TestCaseID: { type: String, required: true },
  TestCaseName: { type: String, required: true },
  RunID: { type: String, required: true, ref: 'Run' }
}, { timestamps: true });

testCaseSchema.index({ RunID: 1, TestCaseName: 1 }, { unique: true }); // Unique per run

module.exports = mongoose.model('TestCase', testCaseSchema);
