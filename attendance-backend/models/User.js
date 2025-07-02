const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["student", "faculty"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);
