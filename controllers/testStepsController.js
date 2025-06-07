const TestSteps = require('../models/TestSteps');
const Project = require('../models/Project');
const Release = require('../models/Release');
const Run = require('../models/Run');

// Helper to validate Project, Release, and Run existence
async function validateProjectReleaseRun(ProjectID, ReleaseID, RunID) {
  if (!ProjectID || !ReleaseID || !RunID) {
    throw { status: 400, message: "ProjectID, ReleaseID, and RunID are required." };
  }

  const projectExists = await Project.exists({ ProjectID });
  if (!projectExists) {
    throw { status: 404, message: `Project with ProjectID '${ProjectID}' not found.` };
  }

  const releaseExists = await Release.exists({ ReleaseID, ProjectID });
  if (!releaseExists) {
    throw { status: 404, message: `Release with ReleaseID '${ReleaseID}' not found for ProjectID '${ProjectID}'.` };
  }

  const runExists = await Run.exists({ RunID, ReleaseID, ProjectID });
  if (!runExists) {
    throw { status: 404, message: `Run with RunID '${RunID}' not found for ReleaseID '${ReleaseID}' and ProjectID '${ProjectID}'.` };
  }
}

// ✅ Create a full test case with multiple steps - Scoped validation & existence checks
exports.createTestCaseWithSteps = async (req, res) => {
  try {
    const {
      ProjectID,
      ReleaseID,
      RunID,
      TestCaseName,
      steps
    } = req.body;

    // 🛡️ Validate required fields
    if (!ProjectID || !ReleaseID || !RunID || !TestCaseName || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'All required fields must be provided and steps must be an array' });
    }

    // 🔍 Validate existence of Project, Release, and Run
    await validateProjectReleaseRun(ProjectID, ReleaseID, RunID);
    // 🧠 Check for existing TestCaseID scoped by Project → Release → Run
    const existing = await TestSteps.findOne({ ProjectID, ReleaseID, RunID, TestCaseName });
    if (existing) {
      return res.status(400).json({
        message: `Test Case Name '${TestCaseName}' already exists under Project '${ProjectID}', Release '${ReleaseID}', and Run '${RunID}'`
      });
    }
    const count = await TestSteps.countDocuments({ RunID });
    const TestCaseID = `TC-${String(count + 1).padStart(5, '0')}`;
    // 📝 Save the new test case with steps
    const newTestCase = new TestSteps({
      ProjectID,
      ReleaseID,
      RunID,
      TestCaseID,
      TestCaseName,
      steps
    });

    await newTestCase.save();

    res.status(201).json({
      message: 'Test case created successfully',
      data: newTestCase
    });

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  }
};

// ✅ Get test case and its steps by TestCaseID (optionally scoped if needed)
exports.getTestCaseByTestCaseID = async (req, res) => {
  try {
    const { TestCaseID } = req.params;

    const testCase = await TestSteps.findOne({ TestCaseID }).select('-__v');
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }

    res.status(200).json(testCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all test cases (optional listing)
exports.getAllTestCases = async (req, res) => {
  try {
    const testCases = await TestSteps.find().select('-__v');
    res.status(200).json(testCases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
