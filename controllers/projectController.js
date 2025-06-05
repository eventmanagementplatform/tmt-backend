const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { ProjectName } = req.body;
    const existing = await Project.findOne({ ProjectName: { $regex: new RegExp(`^${ProjectName}$`, 'i') } });
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

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().select('-_id -__v');
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
