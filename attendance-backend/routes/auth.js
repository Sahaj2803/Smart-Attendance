const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const { getCurrentUser } = require("../controllers/authController");

//  Middleware: Faculty check 
const verifyFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ error: "Only faculty allowed" });
  }
  next();
};

//  DELETE student controller
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

//  POST: Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

//  POST: Login (general)
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: `You are not authorized to login as ${role}` });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPass } = user._doc;
    res.json({ token, user: userWithoutPass });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

//  POST: Faculty Login
router.post("/faculty-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "faculty" });
    if (!user) return res.status(404).json({ error: "Faculty not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPass } = user._doc;
    res.json({ token, user: userWithoutPass });
  } catch (err) {
    console.error("Faculty login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

//  POST: Student Login
router.post("/student-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "student" });
    if (!user) return res.status(404).json({ error: "Student not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPass } = user._doc;
    res.json({ token, user: userWithoutPass });
  } catch (err) {
    console.error("Student login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

//  GET: List all students (faculty only)
router.get("/students", protect, verifyFaculty, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    console.error("Get students error:", err.message);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

//  DELETE: Delete student (faculty only)
router.delete("/student/:id", protect, verifyFaculty, deleteStudent);

module.exports = router;


