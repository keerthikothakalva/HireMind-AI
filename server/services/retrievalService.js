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

  console.log(
    "===== VECTOR SEARCH ====="
  );

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

  const results =
    await mongoose.connection
      .collection("resumechunks")
      .aggregate([
        {
          $vectorSearch: {
            index: "resume_vector_index",

            path: "embedding",

            queryVector: queryEmbedding,

            numCandidates: Math.max(
              50,
              limit * 20
            ),

            limit,

            filter: {
  $and: [
    { userEmail: { $eq: normalizedEmail } },
    { resumeId: { $eq: normalizedResumeId } }
  ]
},
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
              $meta:
                "vectorSearchScore",
            },
          },
        },
      ])
      .toArray();

  console.log(
    "Vector search results:",
    results.length
  );

  if (results.length > 0) {
    console.log(
      "Top similarity score:",
      results[0].score
    );
  }

  console.log(
    "========="
  );

  return results;
};

module.exports = {
  retrieveRelevantChunks,
};