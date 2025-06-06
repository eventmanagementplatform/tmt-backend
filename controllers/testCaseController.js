const TestCase = require('../models/TestCases');
const Run = require('../models/Run');

exports.addTestCase = async (req, res) => {
  try {
    const { RunID, TestCaseName, step, expected, actual, status, actions } = req.body;

    const run = await Run.findOne({ RunID });
    if (!run) return res.status(404).json({ message: 'Run not found' });

    const existing = await TestCase.findOne({ RunID, TestCaseName });
    if (existing) return res.status(400).json({ message: 'Test case already exists' });

    const count = await TestCase.countDocuments({ RunID });
    const TestCaseID = `TC-${String(count + 1).padStart(5, '0')}`;

    const testCase = new TestCase({
      TestCaseID,
      TestCaseName,
      RunID,
      step,
      expected,
      actual,
      status,
      actions
    });

    await testCase.save();
    res.status(201).json(testCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTestCasesByRun = async (req, res) => {
  try {
    const { RunID } = req.params;
    const testCases = await TestCase.find({ RunID }).select('-_id -__v');
    res.status(200).json(testCases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};