const Subject = require("../models/Subject");

// ✅ Get all subjects (faculty + student, anyone logged in)
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    console.error("❌ Get Subjects Error:", err.message);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// ✅ Create a subject (faculty only)
const createSubject = async (req, res) => {
  const { name, code } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  try {
    const existing = await Subject.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: "Subject already exists" });
    }

    const subject = new Subject({
      name: name.trim(),
      code: code ? code.trim() : undefined,
      createdBy: req.user.id,
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error("❌ Create Subject Error:", err.message);
    res.status(500).json({ error: "Failed to create subject" });
  }
};

// ✅ Delete a subject (faculty only)
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Subject Error:", err.message);
    res.status(500).json({ error: "Failed to delete subject" });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  deleteSubject,
};