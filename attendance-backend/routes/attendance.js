const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceReport,
} = require("../controllers/attendanceController");

// 🔒 Faculty marks attendance
router.post("/mark", protect, markAttendance);

// 🔒 Student sees their own attendance
router.get("/my", protect, getStudentAttendance);

// 🔒 Report (student sees own, faculty sees all)
router.get("/report", protect, getAttendanceReport);

// 🔒 Admin sees all attendance reports
router.get("/admin/report", protect, getAttendanceReport);

module.exports = router;
