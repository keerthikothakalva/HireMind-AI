const mongoose = require("mongoose");
const {
  generateEmbedding,
} = require("./embeddingService");

const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return -1;
  }

  if (a.length !== b.length) {
    return -1;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return -1;
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB))
  );
};

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

  const collection =
    mongoose.connection.collection(
      "resumechunks"
    );

  const resumeChunks =
    await collection
      .find({
        userEmail: normalizedEmail,
        resumeId: normalizedResumeId,
      })
      .project({
        _id: 1,
        userEmail: 1,
        resumeId: 1,
        text: 1,
        chunkIndex: 1,
        embedding: 1,
      })
      .toArray();

  console.log(
    "Direct resume chunk count:",
    resumeChunks.length
  );

  if (resumeChunks.length > 0) {
    const rankedChunks =
      resumeChunks
        .map((chunk) => ({
          ...chunk,
          score: cosineSimilarity(
            queryEmbedding,
            chunk.embedding
          ),
        }))
        .filter(
          (chunk) =>
            typeof chunk.score === "number" &&
            chunk.score >= 0
        )
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .slice(0, limit);

    console.log(
      "Fallback similarity results:",
      rankedChunks.length
    );

    if (rankedChunks.length > 0) {
      console.log(
        "Top similarity score:",
        rankedChunks[0].score
      );
    }

    console.log("=========");

    return rankedChunks.map(
      (chunk) => ({
        userEmail:
          chunk.userEmail,

        resumeId:
          chunk.resumeId,

        text:
          chunk.text,

        chunkIndex:
          chunk.chunkIndex,

        score:
          chunk.score,
      })
    );
  }

  console.log(
    "No exact resume chunks found."
  );

  console.log(
    "Trying Atlas Vector Search..."
  );

  const results =
    await collection
      .aggregate([
        {
          $vectorSearch: {
            index:
              "resume_vector_index",

            path:
              "embedding",

            queryVector:
              queryEmbedding,

            numCandidates:
              Math.max(
                100,
                limit * 20
              ),

            limit: Math.max(
              20,
              limit
            ),
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
    "Raw vector search results:",
    results.length
  );

  const filteredResults =
    results.filter(
      (chunk) =>
        String(chunk.userEmail)
          .toLowerCase()
          .trim() ===
          normalizedEmail &&
        String(chunk.resumeId)
          .trim() ===
          normalizedResumeId
    );

  console.log(
    "Filtered vector search results:",
    filteredResults.length
  );

  if (
    filteredResults.length > 0
  ) {
    console.log(
      "Top similarity score:",
      filteredResults[0].score
    );
  }

  console.log("=========");

  return filteredResults.slice(
    0,
    limit
  );
};

module.exports = {
  retrieveRelevantChunks,
};