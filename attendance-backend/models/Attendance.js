const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },

  subject: {
    type: String,
    trim: true,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);