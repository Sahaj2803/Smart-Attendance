const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    // Extra profile fields
    rollNo: { type: String, default: null },
    department: { type: String, default: null },
    subject: { type: String, default: null }, // legacy single subject label (faculty)
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // faculty: subjects they teach (multi-select)
    role: { type: String, enum: ["student", "faculty", "admin"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);