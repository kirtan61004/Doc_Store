const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },
  },
  { timestamps: true }
);

// One user can bookmark a file only once
bookmarkSchema.index({ userEmail: 1, fileId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
