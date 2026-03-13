const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String, default: "" },
    filename: { type: String, required: true },   // stored filename on disk
    originalname: { type: String, required: true }, // original uploaded filename
    mimetype: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// A student can submit only once per task
submissionSchema.index({ taskId: 1, studentEmail: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
