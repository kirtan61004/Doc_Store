const express = require("express");
const Bookmark = require("../models/Bookmark");
const Upload = require("../models/Upload");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Add bookmark  POST /bookmarks/:fileId
router.post("/:fileId", verifyToken, async (req, res, next) => {
  try {
    const file = await Upload.findById(req.params.fileId);
    if (!file || file.isDeleted)
      return res.status(404).json({ status: false, message: "File not found." });

    const bookmark = new Bookmark({
      userEmail: req.user.email,
      fileId: req.params.fileId,
    });
    await bookmark.save();

    res.status(201).json({ status: true, message: "Bookmarked successfully." });
  } catch (err) {
    // Duplicate key = already bookmarked
    if (err.code === 11000)
      return res
        .status(409)
        .json({ status: false, message: "Already bookmarked." });
    next(err);
  }
});

// Remove bookmark  DELETE /bookmarks/:fileId
router.delete("/:fileId", verifyToken, async (req, res, next) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      userEmail: req.user.email,
      fileId: req.params.fileId,
    });

    if (!result)
      return res
        .status(404)
        .json({ status: false, message: "Bookmark not found." });

    res.json({ status: true, message: "Bookmark removed." });
  } catch (err) {
    next(err);
  }
});

// Get all bookmarks for the logged-in user  GET /bookmarks
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userEmail: req.user.email })
      .populate("fileId", "originalname filename uploadedBy createdAt")
      .sort({ createdAt: -1 });

    res.json({ status: true, bookmarks });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
