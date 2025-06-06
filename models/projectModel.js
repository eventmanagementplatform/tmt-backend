const mongoose = require('mongoose');

// Run Schema
const runSchema = new mongoose.Schema({
  RunID: String,
  RunName: String
}, { _id: false });

// Release Schema
const releaseSchema = new mongoose.Schema({
  ReleaseID: String,
  ReleaseName: String,
  Runs: [runSchema]
}, { _id: false });

// Project Schema
const projectSchema = new mongoose.Schema({
  ProjectID: {
    type: String,
    unique: true
  },
  ProjectName: {
    type: String,
    required: true,
    unique: true
  },
  Releases: [releaseSchema]
});

// Auto-generate ProjectID (e.g., P-00001)
projectSchema.pre('save', async function (next) {
  if (this.isNew) {
    const last = await this.constructor.findOne().sort({ _id: -1 });
    let nextId = 1;
    if (last?.ProjectID?.match(/^P-(\d+)$/)) {
      nextId = parseInt(last.ProjectID.split('-')[1]) + 1;
    }
    this.ProjectID = `P-${String(nextId).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
