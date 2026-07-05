const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: String,
    teacher: String,
    attendance: Number,
    credits: Number,
    progress: Number,
    notes: String,
  },
  { _id: true }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    due: String,
    dueDate: Date,
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    status: { type: String, default: "Pending" },
    description: String,
  },
  { _id: true }
);

const timetableSchema = new mongoose.Schema(
  {
    time: String,
    subject: String,
    room: String,
    faculty: String,
    status: { type: String, enum: ["Completed", "Current", "Upcoming"], default: "Upcoming" },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const studentDashboardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    semester: { type: String, default: "Semester 6" },
    subjects: [subjectSchema],
    assignments: [assignmentSchema],
    timetable: [timetableSchema],
    career: {
      placementReadinessScore: { type: Number, default: 78 },
      resumeStatus: { type: String, default: "Ready for review" },
      suggestedSkills: [String],
      roadmap: [String],
      skills: [
        {
          name: String,
          value: Number,
        },
      ],
    },
    notifications: [
      {
        title: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
    events: [
      {
        title: String,
        date: String,
        venue: String,
      },
    ],
    conversations: [conversationSchema],
    settings: {
      darkModeUi: { type: Boolean, default: false },
      compactCards: { type: Boolean, default: false },
      emailAlerts: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentDashboard", studentDashboardSchema);
