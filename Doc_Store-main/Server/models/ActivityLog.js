const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "UPLOAD", "DELETE", "LOGIN"
    details: { type: String, default: "" },   // optional context string
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
