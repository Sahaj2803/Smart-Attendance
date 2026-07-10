const StudentDashboard = require("../models/StudentDashboard");
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
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
    subject: "Database Systems",
    due: "Today, 6:00 PM",
    priority: "High",
    status: "Pending",
    description: "Create entities, relationships, cardinality, and normalized tables for a campus system.",
  },
  {
    title: "React Mini Project Review",
    subject: "Web Engineering",
    due: "Tomorrow",
    priority: "Medium",
    status: "In Review",
    description: "Prepare component structure, API flow, screenshots, and a short demo script.",
  },
  {
    title: "AI Ethics Reflection",
    subject: "AI Fundamentals",
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

async function computeSubjectsWithAttendance(studentId) {
  const [subjects, records] = await Promise.all([
    Subject.find().sort({ name: 1 }).populate("createdBy", "name"),
    Attendance.find({ student: studentId }),
  ]);

  // Group attendance records by subject name
  const bySubjectMap = {};
  records.forEach((record) => {
    const key = (record.subject || "General").trim();
    if (!bySubjectMap[key]) bySubjectMap[key] = { present: 0, total: 0 };
    bySubjectMap[key].total += 1;
    if (record.status === "present") bySubjectMap[key].present += 1;
  });

  // Build subject list with computed attendance % from real subjects (faculty-added)
  const subjectList = subjects.map((subject) => {
    const stat = bySubjectMap[subject.name] || { present: 0, total: 0 };
    const percentage = stat.total ? Math.round((stat.present / stat.total) * 100) : 0;
    return {
      _id: subject._id,
      name: subject.name,
      code: subject.code || "",
      teacher: subject.createdBy?.name || "Faculty",
      attendance: percentage,
      present: stat.present,
      total: stat.total,
    };
  });

  // Overall attendance across all subjects
  const overallTotal = records.length;
  const overallPresent = records.filter((record) => record.status === "present").length;
  const overallPercentage = overallTotal ? Math.round((overallPresent / overallTotal) * 100) : 0;

  const attendanceSummary = {
    overall: { present: overallPresent, total: overallTotal, percentage: overallPercentage },
    bySubject: subjectList.map((subject) => ({
      subject: subject.name,
      present: subject.present,
      total: subject.total,
      percentage: subject.attendance,
    })),
  };

  // Timetable built from real subjects. Subject model has no schedule fields yet,
  // so time/room are randomly assigned for now — add schedule fields to the Subject
  // model (day, time, room) later for a real fixed timetable.
  const sampleTimes = ["09:00 AM", "10:30 AM", "12:15 PM", "02:00 PM", "03:30 PM"];
  const sampleRooms = ["Lab 204", "C-112", "AI Studio", "B-308", "Seminar Hall A", "Room 501"];
  const usedTimes = [...sampleTimes].sort(() => Math.random() - 0.5);
  const usedRooms = [...sampleRooms].sort(() => Math.random() - 0.5);

  const timetable = subjectList.map((subject, index) => ({
    time: usedTimes[index % usedTimes.length],
    subject: subject.name,
    room: usedRooms[index % usedRooms.length],
    faculty: subject.teacher,
    status: index === 0 ? "Current" : "Upcoming",
  }));

  return { subjects: subjectList, attendanceSummary, timetable };
}

function buildAssignmentsFromSubjects(subjects) {
  if (!subjects.length) return defaultAssignments;

  const seeds = [
    { suffix: "Case Study", priority: "High", status: "Pending" },
    { suffix: "Practical Assignment", priority: "Medium", status: "In Review" },
    { suffix: "Concept Review", priority: "Low", status: "Draft" },
    { suffix: "Lab Report", priority: "Medium", status: "In Progress" },
  ];
  const dueOptions = ["Today, 6:00 PM", "Tomorrow", "In 2 days", "This Friday", "Next Monday"];

  return subjects.slice(0, 4).map((subject, index) => {
    const seed = seeds[index % seeds.length];
    return {
      title: `${subject.name} ${seed.suffix}`,
      subject: subject.name,
      due: dueOptions[index % dueOptions.length],
      priority: seed.priority,
      status: seed.status,
      description: `Complete the ${seed.suffix.toLowerCase()} for ${subject.name}, guided by ${subject.teacher || "your faculty"}.`,
    };
  });
}

async function getEnrichedDashboard(studentId) {
  const dashboard = await ensureDashboard(studentId);
  const { subjects, attendanceSummary, timetable } = await computeSubjectsWithAttendance(studentId);

  // Self-heal: if real subjects exist but stored assignments don't reference any of
  // them (still holding old generic seed data), regenerate assignments from real subjects.
  if (subjects.length > 0) {
    const subjectNames = new Set(subjects.map((s) => s.name));
    const matchesRealSubject = dashboard.assignments.some((a) => subjectNames.has(a.subject));
    if (!matchesRealSubject) {
      dashboard.assignments = buildAssignmentsFromSubjects(subjects);
      await dashboard.save();
    }
  }

  return { dashboard, subjects, attendanceSummary, timetable };
}

function makeAssistantAnswer(question, dashboard, subjects, timetable) {
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
    return `Today is ${formattedDate}. Your current focus class is ${timetable.find((item) => item.status === "Current")?.subject || "not marked right now"}.`;
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
    const next = timetable.find((item) => item.status === "Current") || timetable.find((item) => item.status === "Upcoming");
    return next ? `Your focus class is ${next.subject} at ${next.time} in ${next.room} with ${next.faculty}.` : "No upcoming class is listed right now.";
  }
  return "Here is a focused answer: revise the concept in small parts, write one example, test yourself with two questions, and ask your faculty or AI mentor for the weak step.";
}

async function askGemini(question, dashboard, subjects, timetable) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
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
    subjects: subjects.map((subject) => ({
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
    timetable: timetable,
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
                "Answer the user's question naturally and completely, like a normal AI assistant would — no restrictions on topic.",
                "Reply in the same language/style the user writes in (Hinglish/English/etc).",
                "If the user asks today's date or current time, use this context: " + `currentDate=${dashboardContext.currentDate}, currentTime=${dashboardContext.currentTime}`,
                "You may optionally use this dashboard context if the question is about the student's subjects, attendance, assignments, timetable, or career/placement — otherwise ignore it completely:",
                JSON.stringify(dashboardContext),
                `Question: ${question}`,
              ].join("\n"),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      },
      // tools: [{ google_search: {} }], // TEMP: disabled to test if grounding was causing the 429
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${details}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim() || null;
}

function buildStudyPlan(dashboard, subjects) {
  const weakestSubject = [...subjects].sort((a, b) => (a.attendance || 0) - (b.attendance || 0))[0];
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
    const { dashboard, subjects, timetable, attendanceSummary } = await getEnrichedDashboard(req.user.id);
    const user = await User.findById(req.user.id).select("-password");

    const dashboardObj = dashboard.toObject();
    dashboardObj.subjects = subjects;
    dashboardObj.timetable = timetable;
    dashboardObj.attendanceSummary = attendanceSummary;

    res.json({ dashboard: dashboardObj, user });
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

    const { dashboard, subjects, timetable } = await getEnrichedDashboard(req.user.id);
    let answer;
    let source = "local";
    let geminiDebug = null;

    try {
      answer = await askGemini(question.trim(), dashboard, subjects, timetable);
      if (answer) source = "gemini";
    } catch (geminiError) {
      console.error("Gemini assistant fallback:", geminiError.message);
      geminiDebug = geminiError.message; // TEMPORARY: remove once fixed
    }

    if (!answer) {
      answer = makeAssistantAnswer(question.trim(), dashboard, subjects, timetable);
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
    const { dashboard, subjects } = await getEnrichedDashboard(req.user.id);
    res.json({ plan: buildStudyPlan(dashboard, subjects) });
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

    const rows = ["Date,Subject,Status,Marked By"];
    records.forEach((record) => {
      rows.push(`${record.date.toISOString()},${record.subject || "General"},${record.status},${record.markedBy?.name || "N/A"}`);
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.send(rows.join("\n"));
  } catch (err) {
    console.error("Attendance export error:", err.message);
    res.status(500).json({ error: "Failed to export attendance" });
  }
};

const clearConversations = async (req, res) => {
  try {
    const dashboard = await ensureDashboard(req.user.id);
    dashboard.conversations = [];
    await dashboard.save();
    res.json({ conversations: dashboard.conversations });
  } catch (err) {
    console.error("Clear conversations error:", err.message);
    res.status(500).json({ error: "Failed to clear conversations" });
  }
};

module.exports = {
  getDashboard,
  askAssistant,
  updateAssignmentStatus,
  updateSettings,
  createStudyPlan,
  exportAttendance,
  clearConversations,
};