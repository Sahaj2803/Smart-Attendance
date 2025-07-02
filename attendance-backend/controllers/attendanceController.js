// attendance-backend/controllers/attendanceController.js
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// ✅ Faculty marks attendance
const markAttendance = async (req, res) => {
  const { studentId, status } = req.body;

  try {
    const newRecord = new Attendance({
      student: studentId,
      markedBy: req.user.id, // 🔄 use markedBy (not faculty)
      status,
      date: new Date(),
    });

    await newRecord.save();
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("❌ Mark Attendance Error:", err.message);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

// ✅ Student views their own attendance
const getStudentAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.json(records); // ✅ plain array
  } catch (err) {
    console.error("❌ Get Student Attendance Error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

// ✅ Common report view for student/faculty
const getAttendanceReport = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = {};

    if (role === "student") {
      query.student = id;
    }

    const records = await Attendance.find(query)
      .populate("student", "name email")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.json(records); // ✅ return plain array
  } catch (err) {
    console.error("❌ Report Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to fetch report" });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceReport,
};
