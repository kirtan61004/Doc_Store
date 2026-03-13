const express = require("express");
const ActivityLog = require("../models/ActivityLog");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Get activity logs (admin only), with pagination
// GET /activity?page=1&limit=20&user=email
router.get("/", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.user) filter.userEmail = req.query.user;

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ]);

    res.json({
      status: true,
      data: logs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
