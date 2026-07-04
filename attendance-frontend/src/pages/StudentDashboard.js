import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Bot,
  Brain,
  BriefcaseBusiness,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileBarChart,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import API from "../api";
import CircularProgress from "../components/dashboard/CircularProgress";
import DashboardCard from "../components/dashboard/DashboardCard";
import EmptyState from "../components/dashboard/EmptyState";
import SkeletonCard from "../components/dashboard/SkeletonCard";
import StatCard from "../components/dashboard/StatCard";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Attendance", icon: ClipboardCheck },
  { label: "Subjects", icon: BookOpen },
  { label: "Assignments", icon: FileBarChart },
  { label: "Timetable", icon: CalendarDays },
  { label: "AI Career Mentor", icon: BriefcaseBusiness },
  { label: "AI Doubt Assistant", icon: Bot },
  { label: "Reports", icon: TrendingUp },
  { label: "Profile", icon: UserRound, route: "/profile" },
];

const timetable = [
  { time: "09:00 AM", subject: "Data Structures", room: "Lab 204", faculty: "Prof. Mehta", status: "Completed" },
  { time: "10:30 AM", subject: "Database Systems", room: "C-112", faculty: "Dr. Shah", status: "Current" },
  { time: "12:15 PM", subject: "AI Fundamentals", room: "AI Studio", faculty: "Prof. Rao", status: "Upcoming" },
  { time: "02:00 PM", subject: "Web Engineering", room: "B-308", faculty: "Dr. Patel", status: "Upcoming" },
];

const subjects = [
  { name: "Data Structures", teacher: "Prof. Mehta", attendance: 92, credits: 4, color: "bg-emerald-500" },
  { name: "Database Systems", teacher: "Dr. Shah", attendance: 86, credits: 3, color: "bg-sky-500" },
  { name: "AI Fundamentals", teacher: "Prof. Rao", attendance: 79, credits: 4, color: "bg-violet-500" },
  { name: "Web Engineering", teacher: "Dr. Patel", attendance: 88, credits: 3, color: "bg-amber-500" },
];

const assignments = [
  { title: "DBMS ER Diagram Case Study", due: "Today, 6:00 PM", priority: "High", status: "Pending" },
  { title: "React Mini Project Review", due: "Tomorrow", priority: "Medium", status: "In Review" },
  { title: "AI Ethics Reflection", due: "Jul 08", priority: "Low", status: "Draft" },
];

const careerSkills = [
  { name: "DSA", value: 78 },
  { name: "Projects", value: 66 },
  { name: "Aptitude", value: 72 },
  { name: "Resume", value: 84 },
  { name: "Communication", value: 61 },
];

const weeklyConsistency = [
  { day: "Mon", score: 88 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 92 },
  { day: "Thu", score: 80 },
  { day: "Fri", score: 86 },
  { day: "Sat", score: 70 },
];

const aiConversations = ["Explain normalization", "JavaScript promises", "Career path for AI/ML"];
const promptChips = ["Summarize today's lecture", "Make a study plan", "Explain recursion", "Prepare viva questions"];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    return null;
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toShortDate(date) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(date));
}

function buildTrend(records) {
  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-7);

  if (recent.length === 0) {
    return weeklyConsistency.map((item) => ({ label: item.day, attendance: 0 }));
  }

  return recent.map((record, index) => ({
    label: record.date ? toShortDate(record.date) : `Day ${index + 1}`,
    attendance: record.status === "present" ? 100 : 0,
  }));
}

function Sidebar({ open, onClose, navigate, onLogout }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/70 bg-white/90 px-4 py-5 shadow-2xl shadow-slate-200/80 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/studentDashboard")}
            className="flex items-center gap-3 rounded-2xl text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-400 text-white shadow-lg shadow-indigo-100">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-black text-slate-950">CampusIQ AI</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student hub</span>
            </span>
          </button>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.route) navigate(item.route);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  item.active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-[1.15rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <p className="text-sm font-bold text-slate-900">AI planner is ready</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Turn attendance, assignments, and skills into a focused weekly plan.</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
}

function TopNavbar({ onOpenSidebar, user, darkModeUi, setDarkModeUi, navigate }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-white/70 bg-slate-50/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-b-[1.5rem] lg:border lg:bg-white/70">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenSidebar} className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden rounded-2xl bg-white p-3 text-slate-400 shadow-sm lg:block">
          <PanelLeftClose className="h-5 w-5" />
        </div>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search attendance, assignments, subjects..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
        <button type="button" className="hidden rounded-2xl bg-white p-3 text-slate-500 shadow-sm transition hover:text-slate-950 sm:block">
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setDarkModeUi((value) => !value)}
          className={`hidden h-12 items-center gap-2 rounded-2xl border px-3 text-sm font-bold shadow-sm transition sm:flex ${
            darkModeUi ? "border-slate-800 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600"
          }`}
        >
          <Moon className="h-4 w-4" />
          {darkModeUi ? "Dark" : "Light"}
        </button>
        <button type="button" className="hidden rounded-2xl bg-white p-3 text-slate-500 shadow-sm transition hover:text-slate-950 md:block">
          <Settings className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="flex min-w-0 items-center gap-3 rounded-2xl bg-white px-2 py-2 shadow-sm transition hover:shadow-md sm:px-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-black text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
          </span>
          <span className="hidden min-w-0 text-left lg:block">
            <span className="block truncate text-sm font-black text-slate-950">{user?.name || "Student"}</span>
            <span className="block truncate text-xs font-semibold text-slate-400">{user?.department || "CampusIQ Learner"}</span>
          </span>
        </button>
      </div>
    </header>
  );
}

function StatusBadge({ children, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}>{children}</span>;
}

function SectionHeader({ icon: Icon, title, action, inverse = false }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${inverse ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className={`text-lg font-black ${inverse ? "text-white" : "text-slate-950"}`}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkModeUi, setDarkModeUi] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userInfo = getStoredUser();
        if (userInfo) setUser(userInfo);

        const response = await API.get("/attendance/my");
        setAttendance(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const present = attendance.filter((item) => item.status === "present").length;
    const absent = attendance.filter((item) => item.status === "absent").length;
    const total = attendance.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, total, percentage };
  }, [attendance]);

  const trendData = useMemo(() => buildTrend(attendance), [attendance]);
  const currentLecture = timetable.find((item) => item.status === "Current") || timetable[0];
  const readinessScore = Math.min(96, Math.round((stats.percentage + 74) / 2));
  const aiScore = Math.min(98, Math.round((readinessScore + 86) / 2));
  const studentDepartment = user?.department || "Computer Science";
  const enrollmentNumber = user?.rollNo || user?.enrollmentNo || user?._id?.slice(-8)?.toUpperCase() || "Not assigned";

  const quickStats = [
    {
      icon: ClipboardCheck,
      label: "Attendance",
      value: `${stats.percentage}%`,
      helper: `${stats.present}/${stats.total || 0} present marks`,
      tone: "from-emerald-500 to-teal-400",
    },
    {
      icon: FileBarChart,
      label: "Assignments Pending",
      value: assignments.filter((item) => item.status !== "Submitted").length,
      helper: "Prioritized for this week",
      tone: "from-amber-500 to-orange-400",
    },
    {
      icon: BookOpen,
      label: "Subjects",
      value: subjects.length,
      helper: "Active semester courses",
      tone: "from-sky-500 to-indigo-500",
    },
    {
      icon: CalendarClock,
      label: "Today's Classes",
      value: timetable.length,
      helper: `${currentLecture?.subject || "Next class"} now`,
      tone: "from-fuchsia-500 to-rose-400",
    },
    {
      icon: Brain,
      label: "AI Score",
      value: aiScore,
      helper: "Learning health index",
      tone: "from-violet-500 to-indigo-500",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe,transparent_32%),linear-gradient(135deg,#f8fafc,#eef2ff_52%,#ecfdf5)] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[18rem_1fr]">
          <SkeletonCard className="hidden h-[calc(100vh-3rem)] lg:block" />
          <main className="space-y-5">
            <SkeletonCard className="h-20" />
            <div className="grid gap-4 md:grid-cols-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <SkeletonCard className="h-80" />
              <SkeletonCard className="h-80" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <DashboardCard className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <X className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-xl font-black text-slate-950">Error Loading Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#dcfce7,transparent_28%),linear-gradient(135deg,#f8fafc,#eef2ff_54%,#f0fdfa)] text-slate-950">
      <div className="mx-auto grid max-w-[1480px] gap-0 lg:grid-cols-[18rem_1fr]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} navigate={navigate} onLogout={handleLogout} />

        <main className="min-w-0 px-4 pb-10 sm:px-6 lg:px-8">
          <TopNavbar
            onOpenSidebar={() => setSidebarOpen(true)}
            user={user}
            darkModeUi={darkModeUi}
            setDarkModeUi={setDarkModeUi}
            navigate={navigate}
          />

          <div className="mt-6 space-y-6">
            <DashboardCard className="overflow-hidden p-0" delay={0.02}>
              <div className="relative grid gap-6 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-7">
                <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-sky-200/50 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-emerald-200/60 blur-3xl" />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="indigo">AI-powered campus dashboard</StatusBadge>
                    <StatusBadge tone="green">Live academic pulse</StatusBadge>
                  </div>
                  <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    Welcome back, {user?.name || "Student"}
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Your attendance, timetable, assignments, AI guidance, and performance analytics are organized in one focused workspace.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["Department", studentDepartment],
                      ["Semester", user?.semester || "Semester 6"],
                      ["Enrollment", enrollmentNumber],
                      ["Today", formatDate(new Date())],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                        <p className="mt-1 truncate text-sm font-black text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-[1.15rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Next focus</p>
                      <h2 className="mt-2 text-2xl font-black">{currentLecture?.subject}</h2>
                    </div>
                    <Zap className="h-8 w-8 text-amber-300" />
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Room</span>
                      <span className="font-bold">{currentLecture?.room}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Starts</span>
                      <span className="font-bold">{currentLecture?.time}</span>
                    </div>
                    <button type="button" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                      Open Study Planner
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {quickStats.map((item, index) => (
                <StatCard key={item.label} {...item} delay={0.04 * index} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <DashboardCard delay={0.05}>
                <SectionHeader icon={ClipboardCheck} title="Attendance Intelligence" />
                <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
                  <div className="mx-auto">
                    <CircularProgress value={stats.percentage} />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-emerald-50 p-4">
                        <p className="text-sm font-bold text-emerald-700">Present</p>
                        <p className="mt-1 text-2xl font-black text-emerald-900">{stats.present}</p>
                      </div>
                      <div className="rounded-2xl bg-rose-50 p-4">
                        <p className="text-sm font-bold text-rose-700">Absent</p>
                        <p className="mt-1 text-2xl font-black text-rose-900">{stats.absent}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-600">Attendance trend</p>
                        <StatusBadge tone={stats.percentage >= 75 ? "green" : "amber"}>
                          {stats.percentage >= 75 ? "Healthy" : "Needs focus"}
                        </StatusBadge>
                      </div>
                      <div className="mt-4 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient id="attendanceGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fill="url(#attendanceGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard delay={0.08}>
                <SectionHeader icon={CalendarClock} title="Today's Timetable" action={<StatusBadge tone="amber">Next in 42 min</StatusBadge>} />
                <div className="space-y-3">
                  {timetable.map((item) => (
                    <motion.div
                      key={`${item.time}-${item.subject}`}
                      whileHover={{ x: 4 }}
                      className={`flex flex-col gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                        item.status === "Current"
                          ? "border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 shadow-md shadow-indigo-100"
                          : "border-slate-100 bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.status === "Current" ? "bg-indigo-600 text-white" : "bg-white text-slate-500"}`}>
                          <Clock3 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-950">{item.subject}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{item.faculty} · {item.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span className="text-sm font-black text-slate-700">{item.time}</span>
                        <StatusBadge tone={item.status === "Current" ? "indigo" : item.status === "Completed" ? "green" : "slate"}>{item.status}</StatusBadge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <DashboardCard delay={0.1}>
                <SectionHeader icon={BookOpen} title="Subjects" />
                <div className="grid gap-4 md:grid-cols-2">
                  {subjects.map((subject) => (
                    <div key={subject.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-slate-950">{subject.name}</h3>
                          <p className="mt-1 text-sm font-medium text-slate-500">{subject.teacher}</p>
                        </div>
                        <StatusBadge tone="indigo">{subject.credits} credits</StatusBadge>
                      </div>
                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                          <span>Attendance</span>
                          <span>{subject.attendance}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white">
                          <div className={`h-full rounded-full ${subject.color}`} style={{ width: `${subject.attendance}%` }} />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button type="button" className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:text-slate-950">Notes</button>
                        <button type="button" className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:text-slate-950">Ask AI</button>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard delay={0.12}>
                <SectionHeader icon={FileBarChart} title="Upcoming Assignments" />
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-slate-950">{assignment.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">Due {assignment.due}</p>
                        </div>
                        <StatusBadge tone={assignment.priority === "High" ? "rose" : assignment.priority === "Medium" ? "amber" : "green"}>
                          {assignment.priority}
                        </StatusBadge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <StatusBadge tone="slate">{assignment.status}</StatusBadge>
                        <button type="button" className="text-sm font-black text-indigo-600 hover:text-indigo-800">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <DashboardCard className="bg-gradient-to-br from-slate-950 to-indigo-950 text-white" delay={0.14}>
                <SectionHeader
                  icon={BriefcaseBusiness}
                  title="AI Career Mentor"
                  inverse
                  action={<StatusBadge tone="green">{readinessScore}% ready</StatusBadge>}
                />
                <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <p className="text-sm font-semibold text-indigo-100">Placement Readiness Score</p>
                    <p className="mt-2 text-5xl font-black text-white">{readinessScore}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">Resume is ready for review. Keep improving DSA and communication consistency.</p>
                    <button type="button" className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                      Open AI Career Mentor
                    </button>
                  </div>
                  <div className="space-y-4">
                    {careerSkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="mb-1 flex justify-between text-xs font-bold text-slate-300">
                          <span>{skill.name}</span>
                          <span>{skill.value}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-sky-300" style={{ width: `${skill.value}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-sm font-black text-white">Suggested Skills</p>
                      <p className="mt-2 text-sm text-slate-300">MongoDB indexing, interview DSA, GitHub portfolio, aptitude speed drills.</p>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard className="bg-gradient-to-br from-white to-sky-50" delay={0.16}>
                <SectionHeader icon={Bot} title="AI Doubt Assistant" action={<StatusBadge tone="indigo">Online</StatusBadge>} />
                <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white">
                      <MessageSquareText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-slate-950">Ask any academic question</p>
                      <p className="text-sm font-medium text-slate-500">Get concise explanations and practice prompts.</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <input
                      type="text"
                      placeholder="Type your doubt here..."
                      className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <button type="button" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white">Ask</button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {promptChips.map((prompt) => (
                    <button key={prompt} type="button" className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:text-slate-950">
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="mt-5">
                  <p className="mb-3 text-sm font-black text-slate-900">Latest AI conversations</p>
                  <div className="space-y-2">
                    {aiConversations.map((conversation) => (
                      <div key={conversation} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                        {conversation}
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    ))}
                  </div>
                  <button type="button" className="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-700">
                    Open AI Assistant
                  </button>
                </div>
              </DashboardCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <DashboardCard delay={0.18}>
                <SectionHeader icon={TrendingUp} title="Performance Analytics" />
                <div className="grid gap-5 lg:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 lg:col-span-1">
                    <p className="mb-3 text-sm font-black text-slate-900">Attendance Trend</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 lg:col-span-1">
                    <p className="mb-3 text-sm font-black text-slate-900">Subject Comparison</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjects}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                          <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="attendance" radius={[8, 8, 0, 0]}>
                            {subjects.map((subject) => (
                              <Cell key={subject.name} fill={subject.attendance >= 85 ? "#10b981" : subject.attendance >= 75 ? "#f59e0b" : "#ef4444"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 lg:col-span-1">
                    <p className="mb-3 text-sm font-black text-slate-900">Weekly Consistency</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={weeklyConsistency}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="day" tick={{ fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard delay={0.2}>
                <SectionHeader icon={Clock3} title="Activity Timeline" />
                {attendance.length === 0 ? (
                  <EmptyState
                    icon={ClipboardCheck}
                    title="No attendance activity yet"
                    description="Recent attendance, submissions, announcements, and AI suggestions will appear here."
                  />
                ) : (
                  <div className="space-y-4">
                    {attendance.slice(0, 4).map((record) => (
                      <div key={record._id} className="flex gap-3">
                        <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${record.status === "present" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 p-3">
                          <p className="font-black capitalize text-slate-950">{record.status} attendance marked</p>
                          <p className="mt-1 text-sm font-medium text-slate-500">
                            {record.date ? toShortDate(record.date) : "Recent"} · By {record.markedBy?.name || "Faculty"}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 rounded-2xl bg-indigo-50 p-3">
                        <p className="font-black text-slate-950">AI suggestion</p>
                        <p className="mt-1 text-sm font-medium text-slate-500">Revise DBMS today to protect your weekly consistency score.</p>
                      </div>
                    </div>
                  </div>
                )}
              </DashboardCard>
            </div>

            <DashboardCard delay={0.22}>
              <SectionHeader icon={Target} title="Quick Actions" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[
                  { label: "Download Attendance", icon: Download },
                  { label: "View Timetable", icon: CalendarDays },
                  { label: "Assignments", icon: FileBarChart },
                  { label: "Study Planner", icon: Target },
                  { label: "Campus Events", icon: Home },
                  { label: "Profile", icon: UserRound, action: () => navigate("/profile") },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.action}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 hover:shadow-lg"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-indigo-500" />
                        {action.label}
                      </span>
                      <MoreHorizontal className="h-4 w-4 text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
}
