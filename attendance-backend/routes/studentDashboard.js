const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboard,
  askAssistant,
  updateAssignmentStatus,
  updateSettings,
  createStudyPlan,
  exportAttendance,
} = require("../controllers/studentDashboardController");

router.get("/", protect, getDashboard);
router.post("/assistant/ask", protect, askAssistant);
router.post("/study-plan", protect, createStudyPlan);
router.patch("/assignments/:id/status", protect, updateAssignmentStatus);
router.put("/assignments/:id/status", protect, updateAssignmentStatus);
router.patch("/settings", protect, updateSettings);
router.put("/settings", protect, updateSettings);
router.get("/attendance/export", protect, exportAttendance);

module.exports = router;
