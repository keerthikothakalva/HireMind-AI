const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewQuestions = async ({
  role,
  resumeText,
  experience,
  jobDescription = "",
}) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
You are an expert software engineering interviewer.

Generate exactly 9 professional interview questions
for the candidate.

Target Role:
${role}

Candidate Experience Level:
${experience}

Candidate Resume:
${resumeText}

Job Description:
${jobDescription || "Not provided"}

IMPORTANT INSTRUCTIONS:

- Carefully analyze the candidate's resume.
- Focus on the target role.
- Identify technologies, programming languages,
  frameworks, libraries, databases, tools and concepts
  actually mentioned in the resume.
- Ask questions based on the candidate's actual
  technical background.
- Include questions about projects mentioned
  in the resume.
- Include questions about technologies mentioned
  in the resume.
- Include conceptual technical questions.
- Include practical/problem-solving questions.
- If a job description is provided, make some questions
  relevant to its requirements.
- Do not ask about technologies completely unrelated
  to the resume.
- Adjust difficulty according to experience level.
- Questions should resemble a real technical interview.

Return ONLY a JSON array containing exactly 9 strings.

Example:

[
  "Explain how ...",
  "In your project ...",
  "How would you ..."
]

Do not include markdown.
Do not include numbering.
Do not include explanations outside the JSON.
`,
    });

    console.log(
      "Gemini questions response:",
      response.text
    );

    const text = response.text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(
      "GEMINI QUESTIONS ERROR:",
      error
    );

    throw error;
  }
};

const evaluateInterview = async ({
  role,
  resumeText,
  experience,
  jobDescription = "",
  questions,
  answers,
}) => {
  try {
    const interviewData = questions.map(
      (question, index) => ({
        question,
        answer: answers[index] || "",
      })
    );

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
You are an expert technical interviewer evaluating
a software engineering candidate.

Target Role:
${role}

Candidate Experience Level:
${experience}

Candidate Resume:
${resumeText}

Job Description:
${jobDescription || "Not provided"}

Interview Questions and Answers:

${JSON.stringify(
  interviewData,
  null,
  2
)}

Evaluate the candidate carefully.

Evaluate:

1. Communication
2. Technical Knowledge
3. Problem Solving
4. Confidence
5. Overall Performance

Also identify the candidate's technology stack.

TECHNOLOGY STACK RULES:

- Extract technologies from the resume.
- Consider technologies relevant to the interview.
- Include programming languages, frameworks,
  libraries, databases, APIs, tools and platforms.
- Do NOT invent technologies.
- Do NOT add technologies simply because they are
  commonly used in software development.
- Only include technologies supported by the
  candidate's resume/interview.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "problemSolving": 0,
  "confidence": 0,
  "techStacks": [],
  "summary": "",
  "strengths": [],
  "areasToImprove": []
}

Rules:

- All scores must be integers from 0 to 100.
- strengths must contain exactly 4 items.
- areasToImprove must contain exactly 4 items.
- summary must be a short professional evaluation.
- Do not include markdown.
- Do not include explanations outside the JSON.
`,
    });

    console.log(
      "Gemini evaluation response:",
      response.text
    );

    const text = response.text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(
      "GEMINI EVALUATION ERROR:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterview,
};