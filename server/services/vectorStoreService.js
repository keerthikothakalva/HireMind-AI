const ResumeChunk = require("../models/ResumeChunk");
const { splitResumeText } = require("./textChunker");
const { generateEmbeddings } = require("./embeddingService");

const storeResumeEmbeddings = async ({
  userEmail,
  resumeId,
  resumeText,
}) => {
  if (!userEmail) {
    throw new Error("User email is required.");
  }

  if (!resumeId) {
    throw new Error("Resume ID is required.");
  }

  if (!resumeText) {
    throw new Error("Resume text is required.");
  }

  const normalizedEmail = userEmail
    .toLowerCase()
    .trim();

  const normalizedResumeId = String(resumeId).trim();

  
  const chunks = await splitResumeText(resumeText);

  if (!chunks || chunks.length === 0) {
    throw new Error("No resume chunks were created.");
  }

  console.log(
    `Created ${chunks.length} resume chunks.`
  );

  
  const texts = chunks.map(
    (chunk) => chunk.text
  );

  const vectors = await generateEmbeddings(texts);

  if (
    !vectors ||
    vectors.length !== chunks.length
  ) {
    throw new Error(
      "Embedding count does not match chunk count."
    );
  }

  console.log(
    `Generated ${vectors.length} embeddings.`
  );

 
  await ResumeChunk.deleteMany({
    userEmail: normalizedEmail,
    resumeId: normalizedResumeId,
  });

  
  const documents = chunks.map(
    (chunk, index) => ({
      userEmail: normalizedEmail,

      resumeId: normalizedResumeId,

      chunkIndex:
        chunk.chunkIndex ?? index,

      text: chunk.text,

      embedding: vectors[index],
    })
  );

 
  const savedChunks =
    await ResumeChunk.insertMany(
      documents
    );

  console.log(
    `Stored ${savedChunks.length} resume chunks with embeddings.`
  );

  console.log(
    "Stored resume:",
    normalizedResumeId
  );

  console.log(
    "Stored user:",
    normalizedEmail
  );

  return savedChunks;
};

module.exports = {
  storeResumeEmbeddings,
};