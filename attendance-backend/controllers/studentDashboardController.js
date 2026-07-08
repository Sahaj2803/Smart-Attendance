const StudentDashboard = require("../models/StudentDashboard");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const defaultSubjects = [
  {
    name: "Data Structures",
    teacher: "Prof. Mehta",
    attendance: 92,
    credits: 4,
    progress: 76,
    notes: "Focus on trees, graphs, sorting complexity, and practical recursion tracing.",
  },
  {
    name: "Database Systems",
    teacher: "Dr. Shah",
    attendance: 86,
    credits: 3,
    progress: 68,
    notes: "Revise ER diagrams, normalization, SQL joins, indexing, and transactions.",
  },
  {
    name: "AI Fundamentals",
    teacher: "Prof. Rao",
    attendance: 79,
    credits: 4,
    progress: 72,
    notes: "Prepare search algorithms, model evaluation, classification, and ethics examples.",
  },
  {
    name: "Web Engineering",
    teacher: "Dr. Patel",
    attendance: 88,
    credits: 3,
    progress: 81,
    notes: "Practice React state flow, REST integration, auth, deployment, and responsive UI.",
  },
];

const defaultAssignments = [
  {
    title: "DBMS ER Diagram Case Study",
    due: "Today, 6:00 PM",
    priority: "High",
    status: "Pending",
    description: "Create entities, relationships, cardinality, and normalized tables for a campus system.",
  },
  {
    title: "React Mini Project Review",
    due: "Tomorrow",
    priority: "Medium",
    status: "In Review",
    description: "Prepare component structure, API flow, screenshots, and a short demo script.",
  },
  {
    title: "AI Ethics Reflection",
    due: "Jul 08",
    priority: "Low",
    status: "Draft",
    description: "Write a short note on bias, privacy, explainability, and responsible AI usage.",
  },
];

const defaultTimetable = [
  { time: "09:00 AM", subject: "Data Structures", room: "Lab 204", faculty: "Prof. Mehta", status: "Completed" },
  { time: "10:30 AM", subject: "Database Systems", room: "C-112", faculty: "Dr. Shah", status: "Current" },
  { time: "12:15 PM", subject: "AI Fundamentals", room: "AI Studio", faculty: "Prof. Rao", status: "Upcoming" },
  { time: "02:00 PM", subject: "Web Engineering", room: "B-308", faculty: "Dr. Patel", status: "Upcoming" },
];

function defaultCareer() {
  return {
    placementReadinessScore: 78,
    resumeStatus: "Ready for review",
    suggestedSkills: ["MongoDB indexing", "Interview DSA", "GitHub portfolio", "Aptitude speed drills"],
    roadmap: [
      "Complete two DSA problems daily",
      "Polish one MERN project case study",
      "Revise DBMS and OS interview basics",
      "Practice one mock interview this week",
    ],
    skills: [
      { name: "DSA", value: 78 },
      { name: "Projects", value: 66 },
      { name: "Aptitude", value: 72 },
      { name: "Resume", value: 84 },
      { name: "Communication", value: 61 },
    ],
  };
}

async function ensureDashboard(studentId) {
  let dashboard = await StudentDashboard.findOne({ student: studentId });
  if (dashboard) return dashboard;

  dashboard = await StudentDashboard.create({
    student: studentId,
    subjects: defaultSubjects,
    assignments: defaultAssignments,
    timetable: defaultTimetable,
    career: defaultCareer(),
    notifications: [
      {
        title: "Faculty announcement",
        message: "DBMS case study review is scheduled for this week.",
      },
      {
        title: "AI suggestion",
        message: "Revise normalization and SQL joins before your next class.",
      },
    ],
    events: [
      { title: "Campus Tech Fest", date: "Jul 12", venue: "Main Auditorium" },
      { title: "Placement Readiness Workshop", date: "Jul 15", venue: "Seminar Hall B" },
    ],
    conversations: [
      {
        question: "Explain normalization",
        answer: "Normalization organizes tables to reduce duplication and improve data consistency.",
      },
      {
        question: "JavaScript promises",
        answer: "A Promise represents async work that can resolve successfully or reject with an error.",
      },
    ],
  });

  return dashboard;
}

function makeAssistantAnswer(question, dashboard) {
  const text = question.toLowerCase();
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(now);
  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(now);

  if (
    text.includes("today date") ||
    text.includes("today's date") ||
    text.includes("what is today date") ||
    text.includes("what is the date") ||
    text.includes("aaj ki date") ||
    text.includes("date today")
  ) {
    return `Today is ${formattedDate}.`;
  }

  if (
    text.includes("current time") ||
    text.includes("what time") ||
    text.includes("time now") ||
    text.includes("abhi time") ||
    text.includes("aaj time")
  ) {
    return `Current time is ${formattedTime} IST.`;
  }

  if (text.includes("today") || text.includes("aaj")) {
    return `Today is ${formattedDate}. Your current focus class is ${dashboard.timetable.find((item) => item.status === "Current")?.subject || "not marked right now"}.`;
  }

  if (text.includes("attendance")) {
    return "Your attendance can improve fastest by prioritizing current and upcoming lectures. Start with the subject below 85%, then keep a two-week no-absence streak.";
  }
  if (text.includes("assignment") || text.includes("due")) {
    const pending = dashboard.assignments.find((item) => item.status !== "Submitted");
    return pending
      ? `Start with "${pending.title}" because it is marked ${pending.priority} priority and due ${pending.due}. Break it into research, draft, review, and submission.`
      : "All listed assignments look complete. Use this time for revision and project polish.";
  }
  if (text.includes("career") || text.includes("placement") || text.includes("resume")) {
    return `Your readiness score is ${dashboard.career.placementReadinessScore}. Focus next on ${dashboard.career.suggestedSkills.slice(0, 2).join(" and ")}.`;
  }
  if (text.includes("timetable") || text.includes("class")) {
    const next = dashboard.timetable.find((item) => item.status === "Current") || dashboard.timetable.find((item) => item.status === "Upcoming");
    return next ? `Your focus class is ${next.subject} at ${next.time} in ${next.room} with ${next.faculty}.` : "No upcoming class is listed right now.";
  }
  return "Here is a focused answer: revise the concept in small parts, write one example, test yourself with two questions, and ask your faculty or AI mentor for the weak step.";
}

async function askGemini(question, dashboard) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const dashboardContext = {
    currentDate: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
    currentTime: new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
    subjects: dashboard.subjects.map((subject) => ({
      name: subject.name,
      attendance: subject.attendance,
      progress: subject.progress,
    })),
    pendingAssignments: dashboard.assignments
      .filter((assignment) => assignment.status !== "Submitted")
      .map((assignment) => ({
        title: assignment.title,
        due: assignment.due,
        priority: assignment.priority,
        status: assignment.status,
      })),
    timetable: dashboard.timetable,
    career: {
      placementReadinessScore: dashboard.career?.placementReadinessScore,
      resumeStatus: dashboard.career?.resumeStatus,
      suggestedSkills: dashboard.career?.suggestedSkills,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "You are CampusIQ AI, an academic doubt assistant for a college student.",
                "Answer in simple, helpful Hinglish/English depending on the user's language.",
                "Keep answers practical, concise, and study-focused.",
                "If the user asks today's date or current time, answer from the provided currentDate/currentTime context.",
                "Use the dashboard context only when relevant.",
                `Dashboard context: ${JSON.stringify(dashboardContext)}`,
                `Student question: ${question}`,
              ].join("\n"),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 550,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${details}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim() || null;
}

function buildStudyPlan(dashboard) {
  const weakestSubject = [...dashboard.subjects].sort((a, b) => (a.attendance || 0) - (b.attendance || 0))[0];
  const highPriority = dashboard.assignments.find((item) => item.priority === "High" && item.status !== "Submitted");

  return [
    {
      title: "Today",
      tasks: [
        weakestSubject ? `Attend or revise ${weakestSubject.name} for 45 minutes` : "Revise your lowest-confidence subject",
        highPriority ? `Finish the first draft of ${highPriority.title}` : "Review pending assignments",
      ],
    },
    {
      title: "This Week",
      tasks: [
        "Practice 5 DSA/aptitude questions",
        "Update resume project bullets",
        "Review attendance trend and avoid missing current lectures",
      ],
    },
  ];
}

const getDashboard = async (req, res) => {
  try {
    const dashboard = await ensureDashboard(req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    res.json({ dashboard, user });
  } catch (err) {
    console.error("Student dashboard fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch student dashboard" });
  }
};

const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const dashboard = await ensureDashboard(req.user.id);
    let answer;
    let source = "local";
    let geminiDebug = null;

    try {
      answer = await askGemini(question.trim(), dashboard);
      if (answer) source = "gemini";
    } catch (geminiError) {
      console.error("Gemini assistant fallback:", geminiError.message);
      geminiDebug = geminiError.message; // TEMPORARY: remove once fixed
    }

    if (!answer) {
      answer = makeAssistantAnswer(question.trim(), dashboard);
    }

    dashboard.conversations.unshift({ question: question.trim(), answer });
    dashboard.conversations = dashboard.conversations.slice(0, 12);
    await dashboard.save();

    res.json({ question: question.trim(), answer, source, geminiDebug, conversations: dashboard.conversations });
  } catch (err) {
    console.error("AI assistant error:", err.message);
    res.status(500).json({ error: "Failed to ask AI assistant" });
  }
};

const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const dashboard = await ensureDashboard(req.user.id);
    const assignment = dashboard.assignments.id(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    assignment.status = status || "In Progress";
    await dashboard.save();
    res.json({ assignment, assignments: dashboard.assignments });
  } catch (err) {
    console.error("Assignment update error:", err.message);
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const dashboard = await ensureDashboard(req.user.id);
    const currentSettings = dashboard.settings?.toObject ? dashboard.settings.toObject() : {};
    dashboard.settings = { ...currentSettings, ...req.body };
    await dashboard.save();
    res.json({ settings: dashboard.settings });
  } catch (err) {
    console.error("Settings update error:", err.message);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

const createStudyPlan = async (req, res) => {
  try {
    const dashboard = await ensureDashboard(req.user.id);
    res.json({ plan: buildStudyPlan(dashboard) });
  } catch (err) {
    console.error("Study plan error:", err.message);
    res.status(500).json({ error: "Failed to create study plan" });
  }
};

const exportAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id })
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    const rows = ["Date,Status,Marked By"];
    records.forEach((record) => {
      rows.push(`${record.date.toISOString()},${record.status},${record.markedBy?.name || "N/A"}`);
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.send(rows.join("\n"));
  } catch (err) {
    console.error("Attendance export error:", err.message);
    res.status(500).json({ error: "Failed to export attendance" });
  }
};

module.exports = {
  getDashboard,
  askAssistant,
  updateAssignmentStatus,
  updateSettings,
  createStudyPlan,
  exportAttendance,
};