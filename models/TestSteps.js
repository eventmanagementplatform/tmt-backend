const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  testSteps: { type: String, required: true },
  expectedResult: { type: String, required: true },
  actualResult: { type: String, default: '' },

  locatorType: {
    type: String,
    enum: [
      'id', 'className', 'cssSelector', 'xpath', 'linkText',
      'name', 'partialLinkText', 'tagName', 'NA'
    ],
    default: 'NA'
  },
  locatorValue: { type: String, default: '' },

  browserActions: {
    type: String,
    enum: [
      'OPEN_BROWSER', 'CLOSE_BROWSER', 'CLOSE', 'ENTER_URL', 'WAIT',
      'IMPLICITLYWAIT', 'EXPLICITWAIT', 'ENTER', 'ISDISPLAYED', 'CLICK',
      'VERIFYTEXT', 'NAVIGATION_TO', 'NAVIGATE_BACK', 'NAVIGATE_FORWARD',
      'NAVIGATE_REFRESH', 'RIGHT_CLICK', 'DOUBLE_CLICK', 'SELECTBYVISIBILETEXT',
      'SELECTBYVALUE', 'SELECTBYINDEX', 'ALERT_WITH_OK', 'ALERT_CONFIRMBOX_WITH_OK',
      'ALERT_CONFIRMBOX_WITH_CANCEL', 'MOUSE_HOVER', 'MOUSE_HOVER_CLICK',
      'DRAG', 'DROP', 'FRAME', 'WINDOW_HANDLES_TO_CHILD', 'SCREENSHOT',
      'ELEMENT_SCREENSHOT'
    ],
    required: true
  },

  testdata: { type: String, default: '' },
  executionStatus: {
    type: String,
    enum: ['PASS', 'FAIL', 'BLOCKED', 'NOT RUN'],
    default: 'NOT RUN'
  }
});

const testStepsSchema = new mongoose.Schema({
  ProjectID: { type: String, required: true },
  ReleaseID: { type: String, required: true },
  RunID: { type: String, required: true },
  TestCaseID: { type: String, required: true, unique: true },
  TestCaseName: { type: String, required: true },

  steps: {
    type: [stepSchema],
    validate: [arr => arr.length > 0, 'At least one test step is required']
  }
}, { timestamps: true });
testStepsSchema.index({ ProjectID: 1, ReleaseID: 1, RunID: 1, TestCaseID: 1 }, { unique: true });

module.exports = mongoose.model('TestSteps', testStepsSchema);
