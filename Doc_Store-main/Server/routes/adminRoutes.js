const express = require("express");
const FacultySignup = require("../models/FacultySignup");
const User = require("../models/User");
const Upload = require("../models/Upload");
const ActivityLog = require("../models/ActivityLog");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// All admin routes require a valid token AND the admin role
router.use(verifyToken, isAdmin);

//  Dashboard stats  GET /admin/stats 
router.get("/stats", async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalFaculty,
      totalDocuments,
      totalDeleted,
      pendingRequests,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "faculty" }),
      Upload.countDocuments({ isDeleted: false }),
      Upload.countDocuments({ isDeleted: true }),
      FacultySignup.countDocuments({ status: "pending" }),
    ]);

    res.json({
      status: true,
      stats: {
        totalUsers,
        totalStudents,
        totalFaculty,
        totalDocuments,
        totalDeleted,
        pendingRequests,
      },
    });
  } catch (err) {
    next(err);
  }
});

//  Pending faculty requests  GET /admin/faculty-requests 
router.get("/faculty-requests", async (req, res, next) => {
  try {
    const requests = await FacultySignup.find({ status: "pending" });
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

//  Approve / reject faculty signup  POST /admin/faculty-approve/:id 
router.post("/faculty-approve/:id", async (req, res, next) => {
  try {
    const { approve } = req.body;
    const request = await FacultySignup.findById(req.params.id);
    if (!request)
      return res
        .status(404)
        .json({ status: false, message: "Request not found." });

    if (approve) {
      // Check if a user account already exists to avoid duplicates
      const existing = await User.findOne({ email: request.email });
      if (!existing) {
        await User.create({
          name: request.name,
          email: request.email,
          password: request.password, // already hashed during faculty signup
          role: "faculty",
        });
      }
      request.status = "approved";
    } else {
      request.status = "rejected";
    }

    await request.save();
    res.json({
      status: true,
      message: `Faculty request ${approve ? "approved" : "rejected"}.`,
    });
  } catch (err) {
    next(err);
  }
});

// ─── All users  GET /admin/users?page=1&limit=20 ─────────────────────────────
router.get("/users", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, { password: 0 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      status: true,
      data: users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Recent activity  GET /admin/activity?limit=20 ───────────────────────────
router.get("/activity", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ status: true, data: logs });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
