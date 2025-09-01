import express from "express";
import Student from "../models/Student.js"; // ye model tumhe banana hoga
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get logged-in student profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update student profile (future edit option ke liye)
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
