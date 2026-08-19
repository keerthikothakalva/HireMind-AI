const mongoose = require("mongoose");

const {
  generateEmbedding,
} = require("./embeddingService");

const retrieveRelevantChunks = async ({
  userEmail,
  resumeId,
  query,
  limit = 5,
}) => {
  if (!userEmail) {
    throw new Error("User email is required.");
  }

  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  if (!query) {
    throw new Error("Search query is required.");
  }

  const normalizedEmail = userEmail
    .toLowerCase()
    .trim();

  const normalizedResumeId =
    String(resumeId).trim();

  console.log("===== VECTOR SEARCH =====");

  console.log(
    "Searching user:",
    normalizedEmail
  );

  console.log(
    "Searching resume:",
    normalizedResumeId
  );

  const queryEmbedding =
    await generateEmbedding(query);

  if (
    !queryEmbedding ||
    !Array.isArray(queryEmbedding) ||
    queryEmbedding.length === 0
  ) {
    throw new Error(
      "Failed to generate query embedding."
    );
  }

  console.log(
    "Query embedding dimensions:",
    queryEmbedding.length
  );

  const vectorResults =
    await mongoose.connection
      .collection("resumechunks")
      .aggregate([
        {
          $vectorSearch: {
            index: "resume_vector_index",

            path: "embedding",

            queryVector: queryEmbedding,

            numCandidates: Math.max(
              100,
              limit * 20
            ),

            limit: 50,
          },
        },

        {
          $project: {
            _id: 0,

            userEmail: 1,

            resumeId: 1,

            text: 1,

            chunkIndex: 1,

            score: {
              $meta: "vectorSearchScore",
            },
          },
        },
      ])
      .toArray();

  console.log(
    "Raw vector search results:",
    vectorResults.length
  );

  const results = vectorResults
    .filter(
      (chunk) =>
        chunk.userEmail === normalizedEmail &&
        String(chunk.resumeId).trim() ===
          normalizedResumeId
    )
    .slice(0, limit);

  console.log(
    "Filtered vector search results:",
    results.length
  );

  if (results.length > 0) {
    console.log(
      "Top similarity score:",
      results[0].score
    );

    console.log(
      "First matching chunk:",
      results[0].chunkIndex
    );
  }

  console.log("=========");

  return results;
};

module.exports = {
  retrieveRelevantChunks,
};