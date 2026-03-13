const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Task = require("../models/Task");
const Submission = require("../models/Submission");
const verifyToken = require("../middleware/auth");
const isFaculty = require("../middleware/isFaculty");

// ─── Multer config for submission files ───────────────────────────────────────
const submissionsDir = path.join(__dirname, "../submissions");
if (!fs.existsSync(submissionsDir)) fs.mkdirSync(submissionsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, submissionsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error("Only PDF, DOC, DOCX, TXT, ZIP files are allowed."));
  },
});

// ─── Submit file for a task (student only) ─────────────────────────────────────
router.post("/:taskId", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.status(403).json({ status: false, message: "Only students can submit files." });

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });

    // Verify student is assigned to this task
    if (!task.assignedStudents.includes(req.user.email))
      return res.status(403).json({ status: false, message: "You are not assigned to this task." });

    if (!req.file)
      return res.status(400).json({ status: false, message: "No file uploaded." });

    // Upsert: if student already submitted, overwrite
    const submission = await Submission.findOneAndUpdate(
      { taskId: task._id, studentEmail: req.user.email },
      {
        studentName: req.user.name || req.user.email,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        status: "pending",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ status: true, submission });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ status: false, message: err.message || "Server error." });
  }
});

// ─── Get all submissions for a task (faculty only) ────────────────────────────
router.get("/task/:taskId", verifyToken, isFaculty, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, createdBy: req.user.email });
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });

    const submissions = await Submission.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
    res.json({ status: true, submissions });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Get student's own submission for a task ──────────────────────────────────
router.get("/my/:taskId", verifyToken, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      taskId: req.params.taskId,
      studentEmail: req.user.email,
    });
    res.json({ status: true, submission: submission || null });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Mark submission as reviewed (faculty only) ───────────────────────────────
router.patch("/:submissionId/review", verifyToken, isFaculty, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { status: "reviewed" },
      { new: true }
    );
    if (!submission)
      return res.status(404).json({ status: false, message: "Submission not found." });
    res.json({ status: true, submission });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Download a submission file ────────────────────────────────────────────────
router.get("/download/:submissionId", async (req, res) => {
  try {
    // Accept token from Authorization header OR ?token= query param
    const authHeader = req.headers["authorization"];
    const tokenFromHeader = authHeader && authHeader.split(" ")[1];
    const token = tokenFromHeader || req.query.token;

    if (!token) return res.status(401).json({ status: false, message: "No token provided." });

    const jwt = require("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ status: false, message: "Invalid token." });
    }

    const submission = await Submission.findById(req.params.submissionId).populate("taskId");
    if (!submission) return res.status(404).json({ status: false, message: "Submission not found." });

    // Allow faculty owner or the student who submitted or admin
    const canAccess =
      decoded.email === submission.studentEmail ||
      (decoded.role === "faculty" && submission.taskId?.createdBy === decoded.email) ||
      decoded.role === "admin";

    if (!canAccess)
      return res.status(403).json({ status: false, message: "Access denied." });

    const filePath = path.join(submissionsDir, submission.filename);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ status: false, message: "File not found on server." });

    res.download(filePath, submission.originalname);
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

module.exports = router;
