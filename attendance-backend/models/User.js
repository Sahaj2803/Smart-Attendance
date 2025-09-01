const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "faculty"],
        default: "student"
    },

    // ✅ Student-specific fields
    rollNo: {
        type: String
    },
    branch: {
        type: String
    },
    semester: {
        type: String
    },
    attendancePercentage: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: ""   // yaha pe image URL store karna future ke liye
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
