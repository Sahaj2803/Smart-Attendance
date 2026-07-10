const User = require("../models/User");
const Subject = require("../models/Subject");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = process.env.JWT_SECRET || "smart-attendance-secret-2026";

// Login Controller
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res
        .status(403)
        .json({ error: `You are not authorized to login as ${role}` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('subjects', 'name code');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get current user error:", err.message);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

// Faculty: select/save multiple subjects they teach (multi-select)
const updateFacultySubjects = async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ error: "Only faculty can select subjects" });
    }

    const { subjectIds } = req.body;
    if (!Array.isArray(subjectIds)) {
      return res.status(400).json({ error: "subjectIds must be an array" });
    }

    // Validate that all provided IDs correspond to real subjects
    const validSubjects = await Subject.find({ _id: { $in: subjectIds } }).select("_id");
    const validIds = validSubjects.map((subject) => subject._id);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subjects: validIds },
      { new: true }
    ).select("-password").populate("subjects", "name code");

    res.json({ subjects: user.subjects });
  } catch (err) {
    console.error("Update faculty subjects error:", err.message);
    res.status(500).json({ error: "Failed to update subjects" });
  }
};

//  Delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findOne({ _id: id, role: "student" });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err.message);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// Update own profile (name, department, rollNo)
const updateProfile = async (req, res) => {
  try {
    const { name, department, rollNo } = req.body;
    const updates = {};
    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (typeof department === "string") updates.department = department.trim();
    if (typeof rollNo === "string") updates.rollNo = rollNo.trim();

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
      .select("-password")
      .populate("subjects", "name code");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  loginUser,
  getCurrentUser,
  deleteStudent,
  updateFacultySubjects,
  updateProfile,
};