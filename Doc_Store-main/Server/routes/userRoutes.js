const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OtpStore = require("../models/OtpStore");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { sendOtpEmail } = require("../utils/mailer");

const router = express.Router();

/** Generate a cryptographically random 6-digit OTP */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

// Signup
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ status: false, message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ status: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.status(201).json({ status: true, message: "Signup successful" });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ status: false, message: "Invalid credentials" });

    // ── Admin: require OTP verification ──────────────────────────────────────
    if (user.role === "admin") {
      const otp = generateOtp();
      // Delete any previous OTP for this email
      await OtpStore.deleteMany({ email: user.email });
      await OtpStore.create({ email: user.email, otp });

      try {
        await sendOtpEmail(user.email, otp);
      } catch (mailErr) {
        console.error("Failed to send OTP email:", mailErr.message);
        return res.status(500).json({
          status: false,
          message: "Could not send OTP. Check server email configuration.",
        });
      }

      return res.json({
        status: true,
        otpRequired: true,
        email: user.email,
        message: "OTP sent to your registered email.",
      });
    }

    // ── Non-admin: normal token flow ─────────────────────────────────────────
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// Verify admin OTP — returns real JWT on success
router.post("/verify-otp", async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ status: false, message: "Email and OTP required" });

    const record = await OtpStore.findOne({ email });
    if (!record)
      return res.status(400).json({ status: false, message: "OTP expired or not found. Please login again." });

    if (record.otp !== otp)
      return res.status(401).json({ status: false, message: "Invalid OTP. Please try again." });

    // OTP matched — delete it and issue JWT
    await OtpStore.deleteMany({ email });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "OTP verified. Login successful.",
      token,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// Get all users  — admin only
router.get("/data", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }); // never return passwords
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Delete user — admin only
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });
    res.json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Change password — authenticated user
router.patch("/change-password", verifyToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ status: false, message: "Current and new password required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ status: false, message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ status: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
