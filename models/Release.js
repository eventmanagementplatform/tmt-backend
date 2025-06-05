const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
  ReleaseID: { type: String, required: true },
  ReleaseName: { type: String, required: true },
  ProjectID: { type: String, required: true, ref: 'Project' }
}, { timestamps: true });

releaseSchema.index({ ProjectID: 1, ReleaseName: 1 }, { unique: true }); // Unique per project

module.exports = mongoose.model('Release', releaseSchema);
