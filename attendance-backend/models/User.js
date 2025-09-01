const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty"], default: "student" },

  // ✅ Extra fields for students
  rollNo: { type: String },
  branch: { type: String },
  semester: { type: Number },
  avatar: { type: String, default: "" },
  attendancePercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

