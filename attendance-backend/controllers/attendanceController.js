const Attendance = require("../models/Attendance");
const User = require("../models/User");

// ✅ Faculty marks attendance
const markAttendance = async (req, res) => {
  const { studentId, status, subject } = req.body;

  try {
    const newRecord = new Attendance({
      student: studentId,
      markedBy: req.user.id,
      status,
      subject: subject && subject.trim() ? subject.trim() : "General",
      date: new Date(),
    });

    await newRecord.save();
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("❌ Mark Attendance Error:", err.message);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const query = { student: req.user.id };

    // Optional: /attendance/my?subject=Maths
    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const records = await Attendance.find(query)
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.json(records); 
  } catch (err) {
    console.error("❌ Get Student Attendance Error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = {};

    if (role === "student") {
      query.student = id;
    }

    // Optional: /attendance/report?subject=Maths
    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const records = await Attendance.find(query)
      .populate("student", "name email")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.json(records);
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