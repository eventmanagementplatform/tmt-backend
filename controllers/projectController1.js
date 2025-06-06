const Project = require('../models/projectModel');

// Create new project
// Create new project (with ProjectName uniqueness check)
exports.createProject = async (req, res) => {
  try {
    const { ProjectName } = req.body;

    // Check if project name already exists (case-insensitive)
    const existing = await Project.findOne({ ProjectName: { $regex: new RegExp(`^${ProjectName}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ message: 'Project name already exists' });
    }

    const project = new Project({ ProjectName });
    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a release to a project (auto-generated ReleaseID)
exports.addRelease = async (req, res) => {
  const { ProjectID, ReleaseName } = req.body;

  try {
    const project = await Project.findOne({ ProjectID });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if ReleaseName already exists in project
    if (project.Releases.some(r => r.ReleaseName === ReleaseName)) {
      return res.status(400).json({ message: 'Release name must be unique within the project' });
    }

    // Generate new ReleaseID: find max existing ReleaseID number and increment
    let maxIdNum = 0;
    project.Releases.forEach(r => {
      const match = r.ReleaseID.match(/^R-(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxIdNum) maxIdNum = num;
      }
    });
    const ReleaseID = `R-${String(maxIdNum + 1).padStart(5, '0')}`;

    // Also check ReleaseID uniqueness (should be unique as generated)
    if (project.Releases.some(r => r.ReleaseID === ReleaseID)) {
      return res.status(500).json({ message: 'ReleaseID conflict detected, try again' });
    }

    const newRelease = { ReleaseID, ReleaseName, Runs: [] };
    project.Releases.push(newRelease);
    await project.save();

    res.status(201).json({ message: 'Release added', release: newRelease });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a run to a release (auto-generated RunID)
exports.addRun = async (req, res) => {
  const { ProjectID, ReleaseID, RunName } = req.body;

  try {
    const project = await Project.findOne({ ProjectID });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const release = project.Releases.find(r => r.ReleaseID === ReleaseID);
    if (!release) return res.status(404).json({ message: 'Release not found' });

    // Check if RunName already exists within the release
    if (release.Runs.some(r => r.RunName === RunName)) {
      return res.status(400).json({ message: 'Run name must be unique within the release' });
    }

    // Generate RunID by finding max existing RunID number
    let maxRunNum = 0;
    release.Runs.forEach(run => {
      const match = run.RunID.match(/^Run-(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxRunNum) maxRunNum = num;
      }
    });
    const RunID = `Run-${String(maxRunNum + 1).padStart(5, '0')}`;

    // Check RunID uniqueness just in case
    if (release.Runs.some(r => r.RunID === RunID)) {
      return res.status(500).json({ message: 'RunID conflict detected, try again' });
    }

    const newRun = { RunID, RunName };
    release.Runs.push(newRun);
    await project.save();

    res.status(201).json({ message: 'Run added', run: newRun });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all projects with nested releases and runs
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
