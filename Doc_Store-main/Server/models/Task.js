const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    deadline: { type: Date, required: true },
    createdBy: { type: String, required: true }, // faculty email
    assignedStudents: [{ type: String }],        // array of student emails
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
