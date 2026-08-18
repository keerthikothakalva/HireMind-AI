const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },
    resumeText: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    questions: {
      type: [String],
      required: true,
    },

    answers: {
      type: [String],
      required: true,
    },

    overallScore: {
      type: Number,
      required: true,
    },

    communication: {
      type: Number,
      required: true,
    },

    technicalKnowledge: {
      type: Number,
      required: true,
    },

    problemSolving: {
      type: Number,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    techStacks: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    areasToImprove: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);