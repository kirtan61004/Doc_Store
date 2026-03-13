const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");
const verifyToken = require("../middleware/auth");

const router = express.Router();

//  Multer config 
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

// Allow only PDF and DOCX
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

//  Routes 

// Upload file (authenticated users only)
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ status: false, message: "No file uploaded." });

      const newUpload = new Upload({
        uploadedBy: req.user.email,
        filename: req.file.filename,
        originalname: req.file.originalname,
      });

      await newUpload.save();
      res
        .status(201)
        .json({ status: true, message: "File uploaded successfully." });
    } catch (err) {
      next(err);
    }
  }
);

// Delete file (owner or admin)
router.delete("/delete/:id", verifyToken, async (req, res, next) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file)
      return res
        .status(404)
        .json({ status: false, message: "File not found." });

    // Only the uploader or an admin can delete
    if (file.uploadedBy !== req.user.email && req.user.role !== "admin")
      return res
        .status(403)
        .json({ status: false, message: "Not authorised to delete this file." });

    const filePath = path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Upload.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "File deleted." });
  } catch (err) {
    next(err);
  }
});

// Get uploads by user
router.get("/user/:email", verifyToken, async (req, res, next) => {
  try {
    // A student can only see their own files; admin can see anyone'ss
    if (
      req.user.email !== req.params.email &&
      req.user.role !== "admin"
    )
      return res
        .status(403)
        .json({ status: false, message: "Access denied." });

    const uploads = await Upload.find({
      uploadedBy: req.params.email,
      isDeleted: false,
    });
    res.json(uploads);
  } catch (err) {
    next(err);
  }
});

// Soft-delete a file (marks isDeleted = true instead of removing)
router.patch("/soft-delete/:id", verifyToken, async (req, res, next) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file)
      return res
        .status(404)
        .json({ status: false, message: "File not found." });

    if (file.uploadedBy !== req.user.email && req.user.role !== "admin")
      return res
        .status(403)
        .json({ status: false, message: "Not authorised." });

    file.isDeleted = true;
    await file.save();
    res.json({ status: true, message: "File moved to trash." });
  } catch (err) {
    next(err);
  }
});

// Search & paginate uploads  GET /uploads/search?q=&page=1&limit=10
router.get("/search", verifyToken, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const q = req.query.q || "";

    const filter = { isDeleted: false };
    if (q) filter.$text = { $search: q };

    const [files, total] = await Promise.all([
      Upload.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Upload.countDocuments(filter),
    ]);

    res.json({
      status: true,
      data: files,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// Handle multer errors (file type / size)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE")
      return res
        .status(400)
        .json({ status: false, message: "File too large. Max size is 5 MB." });
  }
  if (err.message === "Only PDF and DOCX files are allowed.")
    return res.status(400).json({ status: false, message: err.message });
  next(err);
});

module.exports = router;
