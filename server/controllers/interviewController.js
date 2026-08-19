const {
  evaluateInterview,
} = require("../services/geminiService");

const {
  storeResumeEmbeddings,
} = require("../services/vectorStoreService");

const {
  generatePersonalizedQuestions,
} = require("../services/ragService");

const Interview = require("../models/InterviewModel");

const { PDFParse } = require("pdf-parse");

const mammoth = require("mammoth");

const crypto = require("crypto");


const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  const fileName = file.originalname.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    let parser;

    try {
      parser = new PDFParse({
        data: file.buffer,
      });

      const result = await parser.getText();

      const text = result.text?.trim() || "";

      if (!text) {
        throw new Error(
          "Unable to extract text from the PDF resume."
        );
      }

      return text;
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }
  }

  if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    const text = result.value?.trim() || "";

    if (!text) {
      throw new Error(
        "Unable to extract text from the DOCX resume."
      );
    }

    return text;
  }

  throw new Error(
    "Only PDF and DOCX resumes are supported."
  );
};

const getInterviewQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      jobDescription = "",
      userEmail,
    } = req.body || {};

    const resumeFile = req.file;

    console.log("======");
    console.log("INTERVIEW REQUEST");
    console.log("Role:", role);
    console.log("Experience:", experience);
    console.log("Job Description:", jobDescription);
    console.log("User Email:", userEmail);
    console.log(
      "Resume:",
      resumeFile?.originalname || "No resume"
    );
    console.log("=====");

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Target role is required.",
      });
    }

    if (!experience) {
      return res.status(400).json({
        success: false,
        message: "Experience level is required.",
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required.",
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required.",
      });
    }

    console.log("Extracting resume text...");

    const resumeText = await extractResumeText(
      resumeFile
    );

    console.log(
      "Resume extracted successfully:",
      resumeText.length,
      "characters"
    );

    const resumeId = crypto.randomUUID();

    console.log("Resume ID:", resumeId);

    console.log(
      "Creating resume chunks and embeddings..."
    );

    await storeResumeEmbeddings({
      userEmail,
      resumeId,
      resumeText,
    });

    console.log(
      "Resume chunks and embeddings stored successfully."
    );

    console.log(
      "Generating personalized questions using RAG..."
    );

    const ragResult =
      await generatePersonalizedQuestions({
        userEmail,
        resumeId,
        role,
        experience,
        jobDescription,
      });

    if (
      !ragResult ||
      !Array.isArray(ragResult.questions) ||
      ragResult.questions.length === 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "No interview questions were generated.",
      });
    }
    const questions = ragResult.questions.map(
      (item) =>
        typeof item === "string"
          ? item
          : item.question
    );

    console.log(
      "RAG questions generated:",
      questions.length
    );

    return res.status(200).json({
      success: true,
      questions,
      resumeText,
      resumeId,
    });
  } catch (error) {
    console.error(
      "====="
    );

    console.error(
      "INTERVIEW QUESTIONS ERROR:"
    );

    console.error(error);

    console.error(
      "====="
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate interview questions.",
    });
  }
};

const submitInterview = async (req, res) => {
  try {
    const {
      userEmail,
      role,
      experience,
      jobDescription = "",
      resumeText,
      questions,
      answers,
    } = req.body || {};

    console.log("======");
    console.log("INTERVIEW EVALUATION");
    console.log("User Email:", userEmail);
    console.log("Role:", role);
    console.log("Experience:", experience);
    console.log("Questions:", questions?.length);
    console.log("Answers:", answers?.length);
    console.log("======");

    if (!userEmail || !userEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: "User email is required.",
      });
    }

    if (!experience) {
      return res.status(400).json({
        success: false,
        message: "Experience is required.",
      });
    }

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview questions are required.",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview answers are required.",
      });
    }

    console.log("Evaluating interview...");

    const results = await evaluateInterview({
      role,
      resumeText,
      experience,
      jobDescription,
      questions,
      answers,
    });

    console.log(
      "Interview evaluated successfully."
    );

    console.log(
      "Evaluation results:",
      results
    );

    
    const normalizedEmail = userEmail
      .toLowerCase()
      .trim();

    console.log(
      "Saving interview to MongoDB..."
    );

    const interview = await Interview.create({
      userEmail: normalizedEmail,

      role: role || "",

      resumeText: resumeText.trim(),

      experience: experience.trim(),

      questions,

      answers,

      overallScore:
        Number(results.overallScore) || 0,

      communication:
        Number(results.communication) || 0,

      technicalKnowledge:
        Number(
          results.technicalKnowledge
        ) || 0,

      problemSolving:
        Number(results.problemSolving) || 0,

      confidence:
        Number(results.confidence) || 0,

      techStacks:
        Array.isArray(results.techStacks)
          ? results.techStacks
          : [],

      summary:
        results.summary || "",

      strengths:
        Array.isArray(results.strengths)
          ? results.strengths
          : [],

      areasToImprove:
        Array.isArray(results.areasToImprove)
          ? results.areasToImprove
          : [],
    });

    console.log(
      "================"
    );

    console.log(
      "INTERVIEW SAVED SUCCESSFULLY"
    );

    console.log(
      "Interview ID:",
      interview._id.toString()
    );

    console.log(
      "User Email:",
      interview.userEmail
    );

    console.log(
      "Score:",
      interview.overallScore
    );

    console.log(
      "================="
    );

    return res.status(200).json({
      success: true,

      results,

      interviewId:
        interview._id.toString(),
    });

  } catch (error) {

    console.error("=====");

    console.error(
      "INTERVIEW EVALUATION ERROR:"
    );

    console.error(error);

    console.error("======");

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to evaluate interview.",
    });
  }
};


const getInterviewHistory = async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const interviews = await Interview.find({
      userEmail: userEmail
        .toLowerCase()
        .trim(),
    })
      .sort({ createdAt: -1 })
      .select(
        "role experience overallScore communication technicalKnowledge problemSolving confidence summary strengths areasToImprove techStacks createdAt"
      )
      .lean();

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "GET INTERVIEW HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch interview history",
    });
  }
};


module.exports = {
  getInterviewQuestions,
  submitInterview,
  getInterviewHistory,
};