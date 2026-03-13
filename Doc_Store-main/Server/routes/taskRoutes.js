const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const verifyToken = require("../middleware/auth");
const isFaculty = require("../middleware/isFaculty");

// ─── Create a new task (faculty only) ─────────────────────────────────────────
router.post("/", verifyToken, isFaculty, async (req, res) => {
  try {
    const { title, description, deadline, assignedStudents } = req.body;
    if (!title || !deadline)
      return res.status(400).json({ status: false, message: "Title and deadline are required." });

    const task = await Task.create({
      title,
      description: description || "",
      deadline: new Date(deadline),
      createdBy: req.user.email,
      assignedStudents: assignedStudents || [],
    });

    res.json({ status: true, task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Get all tasks created by this faculty ─────────────────────────────────────
router.get("/", verifyToken, isFaculty, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.email }).sort({ createdAt: -1 });
    res.json({ status: true, tasks });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Get tasks assigned to the logged-in student ───────────────────────────────
router.get("/my", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedStudents: req.user.email }).sort({ deadline: 1 });
    res.json({ status: true, tasks });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Get single task by ID ─────────────────────────────────────────────────────
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });
    res.json({ status: true, task });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Update task (faculty owner only) ─────────────────────────────────────────
router.put("/:id", verifyToken, isFaculty, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.email });
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });

    const { title, description, deadline, assignedStudents } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline) task.deadline = new Date(deadline);
    if (assignedStudents) task.assignedStudents = assignedStudents;

    await task.save();
    res.json({ status: true, task });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

// ─── Delete task (faculty owner only) ─────────────────────────────────────────
router.delete("/:id", verifyToken, isFaculty, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.email });
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });
    res.json({ status: true, message: "Task deleted." });
  } catch (err) {
    res.status(500).json({ status: false, message: "Server error." });
  }
});

module.exports = router;
