const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-embedding-001",
});

const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate an embedding.");
  }

  return await embeddings.embedQuery(text);
};

const generateEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("Texts are required to generate embeddings.");
  }

  return await embeddings.embedDocuments(texts);
};

module.exports = {
  generateEmbedding,
  generateEmbeddings,
};