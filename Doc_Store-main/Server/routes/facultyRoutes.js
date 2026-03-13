const express = require("express");
const multer = require("multer");
const path = require("path");
const AssignedFile = require("../models/AssignedFile");
const StudentResponse = require("../models/StudentResponse");
const User = require("../models/User");
const FacultySignup = require("../models/FacultySignup");
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/auth");
const isFaculty = require("../middleware/isFaculty");

const router = express.Router();

//  Multer config 
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only PDF, DOCX, JPG, and PNG files are allowed."), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

//  Routes 

// Faculty signup request (public)
router.post("/signup-request", upload.single("facultyIdPhoto"), async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ status: false, message: "All fields are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ status: false, message: "Passwords do not match." });

    // Check if already submitted or registered
    const existing = await FacultySignup.findOne({ email });
    if (existing)
      return res.status(400).json({ status: false, message: "A request with this email already exists." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ status: false, message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    await FacultySignup.create({
      name,
      email,
      password: hashedPassword,
      facultyIdPhoto: req.file ? req.file.filename : "",
      status: "pending",
    });

    res.status(201).json({ status: true, message: "Signup request submitted! Admin will review and approve your account." });
  } catch (err) {
    next(err);
  }
});
router.post(
  "/assign-file",
  verifyToken,
  isFaculty,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const data = JSON.parse(req.body.data);
      const { facultyEmail, facultyName, studentEmail, task } = data;

      if (!facultyEmail || !facultyName || !studentEmail)
        return res
          .status(400)
          .json({ status: false, message: "Missing required fields." });

      const newAssignedFile = new AssignedFile({
        facultyEmail,
        facultyName,
        studentEmail,
        taskText: task || "",
        filename: req.file ? req.file.filename : "",
        originalname: req.file ? req.file.originalname : "",
      });

      await newAssignedFile.save();
      res
        .status(201)
        .json({ status: true, message: "Task assigned successfully." });
    } catch (err) {
      next(err);
    }
  }
);

// Get all students (faculty only)
router.get("/students", verifyToken, isFaculty, async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }, { name: 1, email: 1 });
    res.json({ status: true, students });
  } catch (err) {
    next(err);
  }
});

// Get submissions for a specific faculty
router.get(
  "/responses/:facultyName",
  verifyToken,
  isFaculty,
  async (req, res, next) => {
    try {
      const submissions = await StudentResponse.find({
        facultyName: req.params.facultyName,
      });
      res.json(submissions);
    } catch (err) {
      next(err);
    }
  }
);

// Approve / reject a student submission
router.post(
  "/grade-submission/:id",
  verifyToken,
  isFaculty,
  async (req, res, next) => {
    try {
      const { status } = req.body;
      if (!["approved", "rejected", "pending"].includes(status))
        return res
          .status(400)
          .json({ status: false, message: "Invalid status value." });

      const updated = await StudentResponse.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updated)
        return res
          .status(404)
          .json({ status: false, message: "Submission not found." });

      res.json({ status: true, message: `Submission marked as ${status}.` });
    } catch (err) {
      next(err);
    }
  }
);

// Handle multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE")
    return res
      .status(400)
      .json({ status: false, message: "File too large. Max size is 5 MB." });
  if (err.message === "Only PDF and DOCX files are allowed." ||
      err.message === "Only PDF, DOCX, JPG, and PNG files are allowed.")
    return res.status(400).json({ status: false, message: err.message });
  next(err);
});

module.exports = router;
