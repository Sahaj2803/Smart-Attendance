// import express from "express";
// import User from "../models/User.js";   // 🔹 ab Student.js ki jagah User.js import
// import { authMiddleware } from "../middleware/auth.js";

// const router = express.Router();

// // ✅ Get logged-in student profile
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const student = await User.findById(req.user.id).select("-password");

//     if (!student || student.role !== "student") {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Update student profile (future edit option ke liye)
// router.put("/me", authMiddleware, async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: req.body },
//       { new: true }
//     ).select("-password");

//     if (!updated || updated.role !== "student") {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
