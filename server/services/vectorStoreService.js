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

  // 1. Split resume into chunks
  const chunks = await splitResumeText(resumeText);

  if (!chunks.length) {
    throw new Error("No resume chunks were created.");
  }

  // 2. Generate embeddings for every chunk
  const texts = chunks.map((chunk) => chunk.text);

  const vectors = await generateEmbeddings(texts);

  if (vectors.length !== chunks.length) {
    throw new Error("Embedding count does not match chunk count.");
  }

  // 3. Remove previous chunks for this resume
  await ResumeChunk.deleteMany({
    userEmail: userEmail.toLowerCase(),
    resumeId,
  });

  // 4. Prepare MongoDB documents
  const documents = chunks.map((chunk, index) => ({
    userEmail: userEmail.toLowerCase(),
    resumeId,
    chunkIndex: chunk.chunkIndex,
    text: chunk.text,
    embedding: vectors[index],
  }));

  // 5. Save chunks + vectors
  const savedChunks = await ResumeChunk.insertMany(documents);

  console.log(
    `Stored ${savedChunks.length} resume chunks with embeddings.`
  );

  return savedChunks;
};

module.exports = {
  storeResumeEmbeddings,
};