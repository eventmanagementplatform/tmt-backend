const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  ProjectID: { type: String, unique: true },
  ProjectName: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
