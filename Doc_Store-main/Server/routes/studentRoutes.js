const express = require("express");
const multer = require("multer");
const path = require("path");
const AssignedFile = require("../models/AssignedFile");
const StudentResponse = require("../models/StudentResponse");
const verifyToken = require("../middleware/auth");

const router = express.Router();

//  Multer config
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only PDF and DOCX files are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//  Routes

// Get assigned files for a student
router.get(
  "/assigned-files/:studentEmail",
  verifyToken,
  async (req, res, next) => {
    try {
      // Students can only see their own assigned files
      if (
        req.user.email !== req.params.studentEmail &&
        req.user.role !== "admin" &&
        req.user.role !== "faculty"
      )
        return res
          .status(403)
          .json({ status: false, message: "Access denied." });

      const files = await AssignedFile.find({
        studentEmail: req.params.studentEmail,
      });
      res.json(files);
    } catch (err) {
      next(err);
    }
  },
);

// Submit student task response
router.post(
  "/submit-task",
  verifyToken,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { taskId, studentEmail, facultyName, facultyEmail } = req.body;

      if (!req.file)
        return res
          .status(400)
          .json({ status: false, message: "No file uploaded." });

      const response = new StudentResponse({
        taskId,
        studentEmail,
        facultyName,
        facultyEmail,
        filename: req.file.filename,
        originalname: req.file.originalname,
      });
      await response.save();

      res
        .status(201)
        .json({ status: true, message: "Response submitted successfully." });
    } catch (err) {
      next(err);
    }
  },
);

// Get a student's own submission history
router.get("/responses/:email", verifyToken, async (req, res, next) => {
  try {
    if (
      req.user.email !== req.params.email &&
      req.user.role !== "admin" &&
      req.user.role !== "faculty"
    )
      return res.status(403).json({ status: false, message: "Access denied." });

    const responses = await StudentResponse.find({
      studentEmail: req.params.email,
    });
    res.json(responses);
  } catch (err) {
    next(err);
  }
});

// Delete a student's own response
router.delete("/delete-response/:id", verifyToken, async (req, res, next) => {
  try {
    const response = await StudentResponse.findById(req.params.id);
    if (!response)
      return res
        .status(404)
        .json({ status: false, message: "Response not found." });

    if (req.user.email !== response.studentEmail && req.user.role !== "admin")
      return res.status(403).json({ status: false, message: "Access denied." });

    await StudentResponse.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Response deleted successfully." });
  } catch (err) {
    next(err);
  }
});

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE")
    return res
      .status(400)
      .json({ status: false, message: "File too large. Max size is 5 MB." });
  if (err.message === "Only PDF and DOCX files are allowed.")
    return res.status(400).json({ status: false, message: err.message });
  next(err);
});

module.exports = router;
