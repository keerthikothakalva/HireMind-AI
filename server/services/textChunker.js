const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const splitResumeText = async (resumeText) => {
  if (!resumeText || typeof resumeText !== "string") {
    throw new Error("Resume text is required for chunking.");
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });

  const documents = await splitter.createDocuments([resumeText]);

  return documents.map((doc, index) => ({
    text: doc.pageContent,
    chunkIndex: index,
  }));
};

module.exports = {
  splitResumeText,
};