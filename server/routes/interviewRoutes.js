const express = require("express");

const router = express.Router();

const {
  getInterviewQuestions,
  submitInterview,
  getInterviewHistory,
} = require("../controllers/interviewController");

const uploadResume = require("../middleware/uploadResume");

router.post(
  "/questions",
  uploadResume.single("resume"),
  getInterviewQuestions
);

router.post(
  "/evaluate",
  submitInterview
);
router.get(
  "/history",
  getInterviewHistory
);

module.exports = router;