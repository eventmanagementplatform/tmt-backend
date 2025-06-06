const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { ProjectName } = req.body;

    const existing = await Project.findOne({
      ProjectName: { $regex: new RegExp(`^${ProjectName}$`, 'i') }
    });
    if (existing) return res.status(400).json({ message: 'Project name already exists' });

    const count = await Project.countDocuments();
    const ProjectID = `P-${String(count + 1).padStart(5, '0')}`;

    const project = new Project({ ProjectID, ProjectName });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().select('-_id -__v');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get project by ProjectID
exports.getProjectById = async (req, res) => {
  try {
    const { ProjectID } = req.params;
    const project = await Project.findOne({ ProjectID }).select('-_id -__v');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update project by ProjectID
exports.updateProject = async (req, res) => {
  try {
    const { ProjectID } = req.params;
    const { ProjectName } = req.body;

    const project = await Project.findOneAndUpdate(
      { ProjectID },
      { ProjectName },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete project by ProjectID
exports.deleteProject = async (req, res) => {
  try {
    const { ProjectID } = req.params;
    const deleted = await Project.findOneAndDelete({ ProjectID });
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
