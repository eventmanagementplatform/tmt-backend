const Run = require('../models/Run');
const Release = require('../models/Release');

exports.addRun = async (req, res) => {
  try {
    const { ProjectID,ReleaseID, RunName } = req.body;
    const release = await Release.findOne({ ProjectID,ReleaseID });
    if (!release) return res.status(404).json({ message: 'Release not found' });

    const existing = await Run.findOne({ ProjectID,ReleaseID, RunName });
    if (existing) return res.status(400).json({ message: 'Run already exists' });

    const count = await Run.countDocuments({ ReleaseID });
    const RunID = `Run-${String(count + 1).padStart(5, '0')}`;

    const run = new Run({ ProjectID,RunID, RunName, ReleaseID });
    await run.save();
    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRunsByRelease = async (req, res) => {
  try {
    const {ProjectID, ReleaseID } = req.params;
    const runs = await Run.find({ ProjectID,ReleaseID }).select('-_id -__v');
    res.status(200).json(runs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
