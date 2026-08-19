const {
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");

const {
  retrieveRelevantChunks,
} = require("./retrievalService");

const model =
  new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,

    model: "gemini-3.6-flash",

    temperature: 0.4,
  });

const generatePersonalizedQuestions =
  async ({
    userEmail,
    resumeId,
    role,
    experience,
    jobDescription = "",
  }) => {
    if (!userEmail) {
      throw new Error(
        "User email is required."
      );
    }

    if (!resumeId) {
      throw new Error(
        "Resume ID is required."
      );
    }

    if (!role) {
      throw new Error("Role is required.");
    }

    console.log(
      "Starting RAG retrieval..."
    );

    const retrievalQuery = `
Candidate skills, projects, technologies,
work experience, education, achievements
and experience relevant to the target role.

Target role:
${role}

Experience level:
${experience || "Not specified"}

Job description:
${jobDescription || "Not provided"}
`;

    const relevantChunks =
      await retrieveRelevantChunks({
        userEmail,
        resumeId,
        query: retrievalQuery,
        limit: 5,
      });

    if (
      !relevantChunks ||
      relevantChunks.length === 0
    ) {
      throw new Error(
        "No relevant resume information was found."
      );
    }

    console.log(
      `Retrieved ${relevantChunks.length} relevant resume chunks.`
    );

    const resumeContext =
      relevantChunks
        .map(
          (chunk) =>
            chunk.text
        )
        .join("\n\n");

    const prompt = `
You are an expert technical interviewer.

Generate a personalized interview for the candidate.

TARGET ROLE:
${role}

EXPERIENCE:
${experience || "Not specified"}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

RELEVANT RESUME CONTEXT:
${resumeContext}

Instructions:

1. Use the resume context to personalize the questions.
2. Ask about the candidate's actual skills.
3. Ask about actual projects mentioned in the resume.
4. Ask about technologies mentioned in the resume.
5. Include technical and behavioral questions.
6. Do not invent experience.
7. Avoid generic questions when resume information is available.
8. Return exactly 9 questions.
9. Return ONLY valid JSON.

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

    console.log(
      "Sending retrieved context to Gemini..."
    );

    const response =
      await model.invoke(prompt);

    const content =
      typeof response.content ===
      "string"
        ? response.content
        : response.content
            .map(
              (item) =>
                item.text || ""
            )
            .join("");

    const cleanedContent =
      content
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    let result;

    try {
      result =
        JSON.parse(cleanedContent);
    } catch (error) {
      console.error(
        "RAG JSON parsing error:",
        content
      );

      throw new Error(
        "Gemini returned an invalid question format."
      );
    }

    if (
      !result.questions ||
      !Array.isArray(
        result.questions
      ) ||
      result.questions.length === 0
    ) {
      throw new Error(
        "Invalid question response from Gemini."
      );
    }

    console.log(
      "RAG question generation successful."
    );

    return {
      questions:
        result.questions,

      retrievedChunks:
        relevantChunks.map(
          (chunk) => ({
            chunkIndex:
              chunk.chunkIndex,

            score:
              chunk.score,
          })
        ),
    };
  };

module.exports = {
  generatePersonalizedQuestions,
};