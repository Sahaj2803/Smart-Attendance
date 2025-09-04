const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

// Admin-only gate
async function adminAuth(req, res, next) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (_e) {
    return res.status(500).json({ message: "Server error" });
  }
}

// ---------- Users (students) ----------
router.get("/users", auth, adminAuth, async (_req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("-password");
    res.json(users);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/users", auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password = "defaultPassword123", rollNo, department } = req.body;

    if (!name || !email) return res.status(400).json({ message: "Name & email required" });

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hash,
      role: "student",
      rollNo,
      department
    });

    res.json({ message: "User created successfully" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.put("/users/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, email, rollNo, department } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email: email && String(email).toLowerCase(), rollNo, department },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.delete("/users/:id", auth, adminAuth, async (req, res) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

// ---------- Faculty ----------
router.get("/faculty", auth, adminAuth, async (_req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" }).select("-password");
    res.json(faculty);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.post("/faculty", auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password = "defaultPassword123", department, subject } = req.body;

    if (!name || !email) return res.status(400).json({ message: "Name & email required" });

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists) return res.status(400).json({ message: "Faculty already exists" });

    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hash,
      role: "faculty",
      department,
      subject
    });

    res.json({ message: "Faculty created successfully" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.put("/faculty/:id", auth, adminAuth, async (req, res) => {
  try {
    const { name, email, department, subject } = req.body;
    const f = await User.findByIdAndUpdate(
      req.params.id,
      { name, email: email && String(email).toLowerCase(), department, subject },
      { new: true }
    ).select("-password");
    if (!f) return res.status(404).json({ message: "Faculty not found" });
    res.json(f);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

router.delete("/faculty/:id", auth, adminAuth, async (req, res) => {
  try {
    const f = await User.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

// ---------- Stats ----------
router.get("/stats", auth, adminAuth, async (_req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalAttendance = await Attendance.countDocuments();
    res.json({ totalStudents, totalFaculty, totalAttendance, systemStatus: "Online" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

// ---------- Attendance reports ----------
router.get("/reports/attendance", auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (department) query.department = department;

    const attendance = await Attendance.find(query)
      .populate("student", "name rollNo department")
      .populate("faculty", "name department");

    res.json(attendance);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

// ---------- Bulk import students ----------
router.post("/users/bulk", auth, adminAuth, async (req, res) => {
  try {
    const { users = [] } = req.body;
    const bcrypt = require("bcryptjs");

    for (const u of users) {
      const email = String(u.email || "").toLowerCase();
      if (!email) continue;

      const exists = await User.findOne({ email });
      if (exists) continue;

      const hash = await bcrypt.hash(u.password || "defaultPassword123", 10);
      await User.create({
        name: u.name || "Student",
        email,
        password: hash,
        role: "student",
        rollNo: u.rollNo,
        department: u.department
      });
    }
    res.json({ message: "Bulk import completed" });
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

// ---------- Export students CSV ----------
router.get("/users/export", auth, adminAuth, async (_req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("name email rollNo department");
    const rows = ["name,email,rollNo,department"];
    users.forEach(u => rows.push(`${u.name},${u.email},${u.rollNo || ""},${u.department || ""}`));
    const csv = rows.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.send(csv);
  } catch (_e) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
