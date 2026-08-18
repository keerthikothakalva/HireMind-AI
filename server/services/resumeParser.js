const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");


const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is required");
  }

  const fileName = file.originalname.toLowerCase();
  const mimeType = file.mimetype;

  
  if (
    mimeType === "application/pdf" ||
    fileName.endsWith(".pdf")
  ) {
    const pdfData = await pdfParse(file.buffer);

    if (!pdfData.text || !pdfData.text.trim()) {
      throw new Error(
        "Could not extract text from the PDF resume"
      );
    }

    return pdfData.text.trim();
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    if (!result.value || !result.value.trim()) {
      throw new Error(
        "Could not extract text from the DOCX resume"
      );
    }

    return result.value.trim();
  }

  throw new Error(
    "Unsupported resume format. Please upload a PDF or DOCX file."
  );
};

module.exports = {
  extractResumeText,
};
