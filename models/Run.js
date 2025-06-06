const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
  RunID: { type: String, required: true },
  RunName: { type: String, required: true },
  ReleaseID: { type: String, required: true, ref: 'Release' },
  ProjectID: { type: String, required: true, ref: 'Project' }
}, { timestamps: true });

runSchema.index({ ProjectID: 1,ReleaseID: 1, RunName: 1 }, { unique: true }); // Unique per release

module.exports = mongoose.model('Run', runSchema);
