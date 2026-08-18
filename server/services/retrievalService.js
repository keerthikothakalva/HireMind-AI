const mongoose = require("mongoose");
const { generateEmbedding } = require("./embeddingService");

const retrieveRelevantChunks = async ({
  userEmail,
  resumeId,
  query,
  limit = 4,
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

  const queryEmbedding = await generateEmbedding(query);

  
  const results = await mongoose.connection
    .collection("resumechunks")
    .aggregate([
      {
        $vectorSearch: {
          index: "resume_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit,
          filter: {
            userEmail: userEmail.toLowerCase(),
            resumeId,
          },
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ])
    .toArray();

  return results;
};

module.exports = {
  retrieveRelevantChunks,
};