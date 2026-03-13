const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    uploadedBy: { type: String, index: true },
    filename: String,
    originalname: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for search on originalname and uploadedBy
uploadSchema.index({ originalname: "text", uploadedBy: "text" });

module.exports = mongoose.model("Upload", uploadSchema);
