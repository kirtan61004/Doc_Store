require("dotenv").config(); // Must be first line — loads .env before anything else

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

//  Routes 
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

const app = express();
const PORT = process.env.PORT || 2000;

//  Global Middleware 
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const submissionsDir = path.join(__dirname, "submissions");
if (!fs.existsSync(submissionsDir)) fs.mkdirSync(submissionsDir, { recursive: true });

//  Database 
connectDB();

//  API Routes 
app.use("/users", userRoutes);
app.use("/faculty", facultyRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/uploads", uploadRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/activity", activityRoutes);
app.use("/tasks", taskRoutes);
app.use("/submissions", submissionRoutes);

//  404 handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found." });
});

// ─── Centralized error handler (MUST be last) ─────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
