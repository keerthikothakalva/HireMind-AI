const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { retrieveRelevantChunks } = require("./retrievalService");

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.4,
});

const generatePersonalizedQuestions = async ({
  userEmail,
  resumeId,
  role,
  experience,
  jobDescription = "",
}) => {
  if (!userEmail) {
    throw new Error("User email is required.");
  }

  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  if (!role) {
    throw new Error("Role is required.");
  }

  
  const retrievalQuery = `
    Candidate skills, projects, technologies, work experience,
    education, achievements and experience relevant to the role:
    ${role}
    
    Experience level:
    ${experience || "Not specified"}
    
    Job description:
    ${jobDescription || "Not provided"}
  `;

  
  const relevantChunks = await retrieveRelevantChunks({
    userEmail,
    resumeId,
    query: retrievalQuery,
    limit: 5,
  });

  if (!relevantChunks.length) {
    throw new Error(
      "No relevant resume information was found."
    );
  }

  
  const resumeContext = relevantChunks
    .map((chunk) => chunk.text)
    .join("\n\n");

  
  const prompt = `
You are an expert technical interviewer.

Generate personalized interview questions for a candidate.

TARGET ROLE:
${role}

EXPERIENCE:
${experience || "Not specified"}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

RELEVANT RESUME CONTEXT:
${resumeContext}

Instructions:

1. Use the relevant resume context to personalize the questions.
2. Ask questions related to the candidate's actual skills,
   projects, technologies and experience.
3. Include a mixture of technical and behavioral questions.
4. Do not invent experience that is not present in the context.
5. Avoid generic questions when the resume provides relevant information.
6. Return exactly 9 interview questions.
7. Return ONLY valid JSON.

Expected format:

{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical"
    }
  ]
}
`;

  //Send retrieved context to Gemini through LangChain
  const response = await model.invoke(prompt);

  const content =
    typeof response.content === "string"
      ? response.content
      : response.content
          .map((item) => item.text || "")
          .join("");


  const cleanedContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  
  let result;

  try {
    result = JSON.parse(cleanedContent);
  } catch (error) {
    console.error("RAG JSON parsing error:", content);
    throw new Error(
      "Gemini returned an invalid question format."
    );
  }

  if (
    !result.questions ||
    !Array.isArray(result.questions)
  ) {
    throw new Error(
      "Invalid question response from Gemini."
    );
  }

  return {
    questions: result.questions,
    retrievedChunks: relevantChunks.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    })),
  };
};

module.exports = {
  generatePersonalizedQuestions,
};