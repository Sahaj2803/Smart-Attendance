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
  // Subject/course this attendance record belongs to.
  // Stored as plain text (subject name) so existing frontend code
  // (which sends/reads `subject` as a string) keeps working without changes.
  // Defaults to "General" so old records / calls without a subject don't break.
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

module.exports = mongoose.model("Attendance", AttendanceSchema);