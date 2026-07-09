const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSubjects,
  createSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// Faculty-only check (same pattern used in routes/auth.js)
const verifyFaculty = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ error: "Only faculty allowed" });
  }
  next();
};

// 🔒 Anyone logged in (faculty or student) can view subjects
router.get("/", protect, getSubjects);

// 🔒 Faculty only: add a new subject
router.post("/", protect, verifyFaculty, createSubject);

// 🔒 Faculty only: remove a subject
router.delete("/:id", protect, verifyFaculty, deleteSubject);

module.exports = router;