const multer = require("multer");

const storage = multer.memoryStorage();

const uploadResume = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".docx"];

    const fileName = file.originalname.toLowerCase();

    const validType = allowedTypes.includes(file.mimetype);

    const validExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (validType && validExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX resumes are supported."));
    }
  },
});

module.exports = uploadResume;