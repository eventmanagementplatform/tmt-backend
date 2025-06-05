const Release = require('../models/Release');
const Project = require('../models/Project');

exports.addRelease = async (req, res) => {
  try {
    const { ProjectID, ReleaseName } = req.body;
    const project = await Project.findOne({ ProjectID });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const existing = await Release.findOne({ ProjectID, ReleaseName });
    if (existing) return res.status(400).json({ message: 'Release already exists' });

    const count = await Release.countDocuments({ ProjectID });
    const ReleaseID = `R-${String(count + 1).padStart(5, '0')}`;

    const release = new Release({ ReleaseID, ReleaseName, ProjectID });
    await release.save();
    res.status(201).json(release);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReleasesByProject = async (req, res) => {
  try {
    const { ProjectID } = req.params;
    const releases = await Release.find({ ProjectID }).select('-_id -__v');
    res.status(200).json(releases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
