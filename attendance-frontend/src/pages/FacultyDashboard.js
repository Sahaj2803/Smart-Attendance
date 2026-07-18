import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  XCircle,
  ClipboardList,
  BarChart3,
  Search,
  Plus,
  UserCircle,
  LogOut,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  Sun,
  Moon,
  Menu,
  Sparkles,
} from "lucide-react";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [markingSubject, setMarkingSubject] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lightMode, setLightMode] = useState(() => localStorage.getItem("facultyLightMode") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("facultyLightMode", String(lightMode));
  }, [lightMode]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userInfo = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
        if (userInfo) {
          setUser(userInfo);
        }

        const [studentsResponse, attendanceResponse] = await Promise.all([
          API.get("/auth/students"),
          API.get("/attendance/report"),
        ]);

        setStudents(studentsResponse.data);
        setAttendance(attendanceResponse.data);

        try {
          const subjectsResponse = await API.get("/subjects");
          const subjectList = subjectsResponse.data || [];
          setSubjects(subjectList);
          if (subjectList.length > 0) {
            setMarkingSubject(subjectList[0].name || subjectList[0]);
          }
        } catch (subjectErr) {
          console.warn("Subjects endpoint not available, deriving subjects from attendance records instead.");
          const derivedSubjects = [...new Set(attendanceResponse.data.map((a) => a.subject).filter(Boolean))];
          setSubjects(derivedSubjects.map((name) => ({ name })));
          if (derivedSubjects.length > 0) {
            setMarkingSubject(derivedSubjects[0]);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addNotification = (message, type) => {
    const notification = { id: Date.now(), message, type, timestamp: new Date() };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 3000);
  };

  const mark = async (studentId, status) => {
    if (!markingSubject) {
      addNotification("Please select a subject before marking attendance", "error");
      return;
    }
    try {
      await API.post("/attendance/mark", { studentId, status, subject: markingSubject });
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report"),
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      addNotification(`Attendance marked as ${status} for ${markingSubject}`, "success");
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      addNotification("Failed to mark attendance", "error");
    }
  };

  const markAllPresent = async () => {
    if (!markingSubject) {
      addNotification("Please select a subject before marking attendance", "error");
      return;
    }
    try {
      const promises = students.map((student) =>
        API.post("/attendance/mark", { studentId: student._id, status: "present", subject: markingSubject })
      );
      await Promise.all(promises);
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report"),
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      addNotification(`All students marked present for ${markingSubject}`, "success");
    } catch (err) {
      console.error("Failed to mark all present:", err);
      addNotification("Failed to mark all present", "error");
    }
  };

  const markAllAbsent = async () => {
    if (!markingSubject) {
      addNotification("Please select a subject before marking attendance", "error");
      return;
    }
    try {
      const promises = students.map((student) =>
        API.post("/attendance/mark", { studentId: student._id, status: "absent", subject: markingSubject })
      );
      await Promise.all(promises);
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report"),
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      addNotification(`All students marked absent for ${markingSubject}`, "success");
    } catch (err) {
      console.error("Failed to mark all absent:", err);
      addNotification("Failed to mark all absent", "error");
    }
  };

  const addSubject = async () => {
    if (!newSubjectName.trim()) {
      addNotification("Subject name is required", "error");
      return;
    }

    setAddingSubject(true);
    try {
      const response = await API.post("/subjects", {
        name: newSubjectName.trim(),
        code: newSubjectCode.trim() || undefined,
      });

      const created = response.data;
      setSubjects((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setMarkingSubject(created.name);
      setNewSubjectName("");
      setNewSubjectCode("");
      setShowAddSubject(false);
      addNotification(`Subject "${created.name}" added successfully`, "success");
    } catch (err) {
      console.error("Failed to add subject:", err);
      const message = err.response?.data?.error || "Failed to add subject";
      addNotification(message, "error");
    } finally {
      setAddingSubject(false);
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await API.delete(`/auth/student/${id}`);
        setStudents(students.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Failed to delete student:", err);
        alert("Failed to delete student");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const subjectFilteredAttendance =
    selectedSubject === "all" ? attendance : attendance.filter((a) => a.subject === selectedSubject);

  const stats = {
    totalStudents: students.length,
    totalAttendance: subjectFilteredAttendance.length,
    presentToday: subjectFilteredAttendance.filter(
      (a) => new Date(a.date).toDateString() === new Date().toDateString() && a.status === "present"
    ).length,
    absentToday: subjectFilteredAttendance.filter(
      (a) => new Date(a.date).toDateString() === new Date().toDateString() && a.status === "absent"
    ).length,
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    const todayAttendance = subjectFilteredAttendance.find(
      (a) => a.student?._id === student._id && new Date(a.date).toDateString() === new Date().toDateString()
    );

    if (filterStatus === "present") return matchesSearch && todayAttendance?.status === "present";
    if (filterStatus === "absent") return matchesSearch && todayAttendance?.status === "absent";
    if (filterStatus === "not_marked") return matchesSearch && !todayAttendance;

    return matchesSearch;
  });

  const getWeeklyTrend = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const dayAttendance = subjectFilteredAttendance.filter((a) => {
        if (!a.date) return false;
        return new Date(a.date).toDateString() === date.toDateString();
      });

      const present = dayAttendance.filter((a) => a.status === "present").length;
      const absent = dayAttendance.filter((a) => a.status === "absent").length;
      const total = present + absent;

      return {
        day,
        present: present || 0,
        absent: absent || 0,
        total: total || 0,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    });
  };

  const getDailyUpdates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayAttendance = subjectFilteredAttendance.filter((a) => {
      if (!a.date) return false;
      return new Date(a.date).toDateString() === today.toDateString();
    });

    const yesterdayAttendance = subjectFilteredAttendance.filter((a) => {
      if (!a.date) return false;
      return new Date(a.date).toDateString() === yesterday.toDateString();
    });

    const todayPresent = todayAttendance.filter((a) => a.status === "present").length;
    const todayAbsent = todayAttendance.filter((a) => a.status === "absent").length;
    const yesterdayPresent = yesterdayAttendance.filter((a) => a.status === "present").length;
    const yesterdayAbsent = yesterdayAttendance.filter((a) => a.status === "absent").length;

    const todayTotal = todayPresent + todayAbsent;
    const yesterdayTotal = yesterdayPresent + yesterdayAbsent;

    const presentChange =
      yesterdayPresent > 0
        ? Math.round(((todayPresent - yesterdayPresent) / yesterdayPresent) * 100)
        : todayPresent > 0
        ? 100
        : 0;
    const absentChange =
      yesterdayAbsent > 0
        ? Math.round(((todayAbsent - yesterdayAbsent) / yesterdayAbsent) * 100)
        : todayAbsent > 0
        ? 100
        : 0;

    return {
      today: {
        present: todayPresent || 0,
        absent: todayAbsent || 0,
        total: todayTotal || 0,
        percentage: todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0,
      },
      yesterday: {
        present: yesterdayPresent || 0,
        absent: yesterdayAbsent || 0,
        total: yesterdayTotal || 0,
        percentage: yesterdayTotal > 0 ? Math.round((yesterdayPresent / yesterdayTotal) * 100) : 0,
      },
      changes: { present: presentChange || 0, absent: absentChange || 0 },
    };
  };

  const getSubjectBreakdown = () => {
    const subjectNames =
      subjects.length > 0 ? subjects.map((s) => s.name || s) : [...new Set(attendance.map((a) => a.subject).filter(Boolean))];

    return subjectNames
      .map((name) => {
        const subjectRecords = attendance.filter((a) => a.subject === name);
        const present = subjectRecords.filter((a) => a.status === "present").length;
        const total = subjectRecords.length;
        return { subject: name, present, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
      })
      .sort((a, b) => b.percentage - a.percentage);
  };

  const analyticsData = {
    attendanceDistribution: [
      { name: "Present", value: subjectFilteredAttendance.filter((a) => a.status === "present").length || 0, color: "#34d399" },
      { name: "Absent", value: subjectFilteredAttendance.filter((a) => a.status === "absent").length || 0, color: "#fb7185" },
    ],
    weeklyTrend: getWeeklyTrend(),
    dailyUpdates: getDailyUpdates(),
    subjectBreakdown: getSubjectBreakdown(),
    studentPerformance: students
      .map((student) => {
        const studentAttendance = subjectFilteredAttendance.filter((a) => a.student?._id === student._id);
        const presentCount = studentAttendance.filter((a) => a.status === "present").length;
        const totalCount = studentAttendance.length;
        const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
        return { name: student.name || "Unknown Student", attendance: percentage || 0, present: presentCount || 0, total: totalCount || 0 };
      })
      .sort((a, b) => b.attendance - a.attendance),
  };

  const bgShell = lightMode
    ? "relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),radial-gradient(circle_at_top_right,#dcfce7,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff_55%,#f0fdfa)] text-slate-900"
    : "relative min-h-screen overflow-hidden bg-[#05060a] text-white";
  const glassCard = lightMode
    ? "rounded-3xl border border-slate-200 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
    : "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl";

  const AmbientBackground = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className={`absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full blur-[120px] ${lightMode ? "bg-indigo-300/30" : "bg-indigo-600/20"}`}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full blur-[120px] ${lightMode ? "bg-emerald-300/25" : "bg-emerald-500/15"}`}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {!lightMode && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_10%,black,transparent)]" />
      )}
    </div>
  );

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "Students", icon: Users, action: () => scrollToSection("students") },
    { label: "Subjects", icon: BookOpen, action: () => scrollToSection("subjects") },
    { label: "Attendance", icon: ClipboardList, action: () => scrollToSection("attendance-records") },
    { label: "Analytics", icon: BarChart3, action: () => { if (!showAnalytics) setShowAnalytics(true); setTimeout(() => scrollToSection("analytics"), 100); } },
    { label: "Profile", icon: UserCircle, action: () => navigate("/profile") },
  ];

  const FacultySidebar = () => (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${lightMode ? "border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/80" : "border-white/10 bg-[#0a0b10]/95 shadow-2xl shadow-black/40"}`}
      >
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate("/facultyDashboard")} className="flex items-center gap-3 rounded-2xl text-left">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl p-1.5 shadow-lg ring-1 ${lightMode ? "bg-white ring-slate-100 shadow-indigo-100" : "bg-white/10 ring-white/15 shadow-[0_0_20px_rgba(129,140,248,0.35)]"}`}>
              <img src="/campus-logo.png" alt="CampusIQ AI logo" className="h-full w-full rounded-xl object-cover" />
            </span>
            <span>
              <span className={`block text-lg font-black ${lightMode ? "text-slate-950" : "text-white"}`}>CampusIQ AI</span>
              <span className={`block text-xs font-semibold uppercase tracking-[0.18em] ${lightMode ? "text-slate-400" : "text-slate-500"}`}>Faculty hub</span>
            </span>
          </button>
          <button type="button" onClick={() => setSidebarOpen(false)} className={`rounded-xl p-2 lg:hidden ${lightMode ? "text-slate-400 hover:bg-slate-100" : "text-slate-400 hover:bg-white/10"}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1.5">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                index === 0
                  ? lightMode
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg"
                  : lightMode
                  ? "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`rounded-[1.15rem] border p-4 ${lightMode ? "border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50" : "border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.02] to-emerald-500/10"}`}>
          <div className="flex items-center gap-3">
            <Sparkles className={`h-5 w-5 ${lightMode ? "text-indigo-500" : "text-indigo-300"}`} />
            <p className={`text-sm font-bold ${lightMode ? "text-slate-900" : "text-white"}`}>AI Insights ready</p>
          </div>
          <p className={`mt-2 text-xs leading-5 ${lightMode ? "text-slate-500" : "text-slate-400"}`}>Attendance patterns and subject-wise trends, auto-generated.</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${lightMode ? "text-rose-600 hover:bg-rose-50" : "text-rose-400 hover:bg-rose-500/10"}`}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );

  if (loading) {
    return (
      <div className={bgShell}>
        <AmbientBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className={`mx-auto h-10 w-10 animate-spin ${lightMode ? "text-indigo-600" : "text-indigo-400"}`} />
            <p className={`mt-4 text-sm font-semibold ${lightMode ? "text-slate-500" : "text-slate-400"}`}>Loading faculty dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={bgShell}>
        <AmbientBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className={`${glassCard} p-10 text-center`}>
            <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" />
            <h3 className="mt-4 text-lg font-black">Error Loading Dashboard</h3>
            <p className={`mt-2 text-sm ${lightMode ? "text-slate-500" : "text-slate-400"}`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={bgShell}>
      <AmbientBackground />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
                notification.type === "success"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-400"
              }`}
            >
              {notification.type === "success" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertTriangle className="h-4 w-4 flex-shrink-0" />}
              <p className="text-sm font-semibold">{notification.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1480px] gap-0 lg:grid-cols-[18rem_1fr]">
        <FacultySidebar />

        <main className={`min-w-0 px-4 pb-10 sm:px-6 lg:px-8 ${lightMode ? "light-faculty" : ""}`}>
          {lightMode && (
            <style>{`
              .light-faculty [class*="text-white"] { color: #0f172a !important; }
              .light-faculty [class*="text-slate-100"] { color: #1e293b !important; }
              .light-faculty [class*="text-slate-200"] { color: #334155 !important; }
              .light-faculty [class*="text-slate-300"] { color: #475569 !important; }
              .light-faculty [class*="text-slate-400"] { color: #64748b !important; }
              .light-faculty [class*="border-white/"] { border-color: #e2e8f0 !important; }
              .light-faculty [class*="divide-white/"] { border-color: #e2e8f0 !important; }
              .light-faculty [class*="ring-white/"] { --tw-ring-color: #e2e8f0 !important; }
              .light-faculty [class*="bg-white/"] { background-color: #ffffff !important; }
              .light-faculty [class*="shadow-black"] { box-shadow: 0 18px 60px rgba(15,23,42,0.08) !important; }
              .light-faculty select option { background-color: #ffffff; color: #0f172a; }
              .light-faculty [class*="bg-slate-900"] { background-color: #ffffff !important; }
            `}</style>
          )}
          {/* Floating top navbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`sticky top-4 z-20 mt-4 flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 backdrop-blur-xl ${
              lightMode ? "border-slate-200 bg-white/90 shadow-lg shadow-slate-200/60" : "border-white/10 bg-white/[0.05] shadow-lg shadow-black/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSidebarOpen(true)} className={`rounded-xl p-2 lg:hidden ${lightMode ? "text-slate-500 hover:bg-slate-100" : "text-slate-400 hover:bg-white/10"}`}>
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className={`text-sm font-black ${lightMode ? "text-slate-900" : "text-white"}`}>Faculty Dashboard</p>
                <p className={`text-xs font-medium ${lightMode ? "text-slate-400" : "text-slate-500"}`}>Welcome back, {user?.name || "Professor"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`hidden items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition sm:inline-flex ${
                  showAnalytics
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg"
                    : lightMode
                    ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Analytics
              </button>
              <button
                type="button"
                onClick={() => setLightMode((v) => !v)}
                className={`rounded-xl p-2.5 transition ${lightMode ? "bg-slate-100 text-amber-500 hover:bg-slate-200" : "bg-white/[0.06] text-indigo-300 hover:bg-white/[0.12]"}`}
                title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
              >
                {lightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={handleProfile}
                className={`hidden items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition sm:inline-flex ${lightMode ? "border border-slate-200 text-slate-600 hover:bg-slate-50" : "border border-white/10 text-slate-300 hover:bg-white/[0.06]"}`}
              >
                <UserCircle className="h-3.5 w-3.5" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/30 transition hover:bg-rose-500"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </motion.div>

          <div className="mt-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Students", value: stats.totalStudents, icon: Users, tone: "text-sky-300", bg: "bg-sky-500/10 ring-sky-400/20", bar: "bg-sky-400/60" },
            { label: "Present Today", value: stats.presentToday, icon: CheckCircle2, tone: "text-emerald-300", bg: "bg-emerald-500/10 ring-emerald-400/20", bar: "bg-emerald-400/60" },
            { label: "Absent Today", value: stats.absentToday, icon: XCircle, tone: "text-rose-300", bg: "bg-rose-500/10 ring-rose-400/20", bar: "bg-rose-400/60" },
            { label: "Total Records", value: stats.totalAttendance, icon: ClipboardList, tone: "text-violet-300", bg: "bg-violet-500/10 ring-violet-400/20", bar: "bg-violet-400/60" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`${glassCard} p-5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.tone}`} />
                </div>
              </div>
              {/* Mini sparkline from this week's trend */}
              <div className="mt-4 flex h-6 items-end gap-1">
                {analyticsData.weeklyTrend.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(day.percentage, 6)}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={`flex-1 rounded-sm ${stat.bar}`}
                    title={`${day.day}: ${day.percentage}%`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={`${glassCard} mb-8 p-6`}
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-300">
            <Sparkles className="h-4 w-4 text-amber-300" />
            AI Insights
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(() => {
              const bestDay = [...analyticsData.weeklyTrend].sort((a, b) => b.percentage - a.percentage)[0];
              const weakestSubject = analyticsData.subjectBreakdown.length > 0 ? [...analyticsData.subjectBreakdown].sort((a, b) => a.percentage - b.percentage)[0] : null;
              const trend = analyticsData.dailyUpdates.changes.present;
              return [
                {
                  text: bestDay && bestDay.total > 0
                    ? `Attendance peaks on ${bestDay.day} at ${bestDay.percentage}%.`
                    : "Not enough data yet to spot a peak day.",
                },
                {
                  text: weakestSubject
                    ? `${weakestSubject.subject} has the lowest attendance at ${weakestSubject.percentage}% — may need attention.`
                    : "Add subjects to see subject-wise insights.",
                },
                {
                  text: `Present rate is ${trend >= 0 ? "up" : "down"} ${Math.abs(trend)}% compared to yesterday.`,
                },
              ];
            })().map((insight, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-xs leading-5 font-medium text-slate-300">{insight.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Analytics */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              id="analytics"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 space-y-6 overflow-hidden"
            >
              {/* Daily updates */}
              <div className={`${glassCard} p-6`}>
                <h3 className="mb-6 flex items-center gap-2 text-lg font-black">
                  <Calendar className="h-5 w-5 text-indigo-300" />
                  Daily Attendance Update
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-300">Today</p>
                    <p className="mt-1 text-2xl font-black">{analyticsData.dailyUpdates.today.percentage}%</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {analyticsData.dailyUpdates.today.present} present, {analyticsData.dailyUpdates.today.absent} absent
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Yesterday</p>
                    <p className="mt-1 text-2xl font-black">{analyticsData.dailyUpdates.yesterday.percentage}%</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {analyticsData.dailyUpdates.yesterday.present} present, {analyticsData.dailyUpdates.yesterday.absent} absent
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <p className={`text-xs font-bold uppercase tracking-wide ${analyticsData.dailyUpdates.changes.present >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                      Present Change
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-2xl font-black">
                      {analyticsData.dailyUpdates.changes.present >= 0 ? <TrendingUp className="h-5 w-5 text-emerald-300" /> : <TrendingDown className="h-5 w-5 text-rose-300" />}
                      {analyticsData.dailyUpdates.changes.present >= 0 ? "+" : ""}
                      {analyticsData.dailyUpdates.changes.present}%
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">vs yesterday</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                    <p className={`text-xs font-bold uppercase tracking-wide ${analyticsData.dailyUpdates.changes.absent <= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                      Absent Change
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-2xl font-black">
                      {analyticsData.dailyUpdates.changes.absent <= 0 ? <TrendingDown className="h-5 w-5 text-emerald-300" /> : <TrendingUp className="h-5 w-5 text-rose-300" />}
                      {analyticsData.dailyUpdates.changes.absent >= 0 ? "+" : ""}
                      {analyticsData.dailyUpdates.changes.absent}%
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">vs yesterday</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className={`${glassCard} p-6`}>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
                    <BarChart3 className="h-5 w-5 text-violet-300" />
                    Overall Attendance Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={analyticsData.attendanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {analyticsData.attendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                        formatter={(value, name) => [`${value} students`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className={`${glassCard} p-6`}>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
                    <TrendingUp className="h-5 w-5 text-sky-300" />
                    Weekly Attendance Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={analyticsData.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                      <Tooltip
                        contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                        formatter={(value, name) => {
                          if (name === "present") return [`${value} students`, "Present"];
                          if (name === "absent") return [`${value} students`, "Absent"];
                          if (name === "percentage") return [`${value}%`, "Attendance %"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#34d399" strokeWidth={3} name="Present" dot={{ fill: "#34d399", strokeWidth: 2, r: 4 }} />
                      <Line type="monotone" dataKey="absent" stroke="#fb7185" strokeWidth={3} name="Absent" dot={{ fill: "#fb7185", strokeWidth: 2, r: 4 }} />
                      <Line type="monotone" dataKey="percentage" stroke="#818cf8" strokeWidth={2} strokeDasharray="5 5" name="Attendance %" dot={{ fill: "#818cf8", strokeWidth: 2, r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject breakdown */}
              {analyticsData.subjectBreakdown.length > 0 && (
                <div className={`${glassCard} p-6`}>
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-black">
                    <BookOpen className="h-5 w-5 text-amber-300" />
                    Subject-wise Attendance
                  </h3>
                  <div className="space-y-4">
                    {analyticsData.subjectBreakdown.map((subj) => (
                      <div key={subj.subject}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-200">{subj.subject}</span>
                          <span className={`text-sm font-black ${subj.percentage >= 80 ? "text-emerald-300" : subj.percentage >= 60 ? "text-amber-300" : "text-rose-300"}`}>
                            {subj.percentage}% ({subj.present}/{subj.total})
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${subj.percentage >= 80 ? "bg-emerald-400" : subj.percentage >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                            style={{ width: `${subj.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student performance */}
              <div className={`${glassCard} p-6`}>
                <h3 className="mb-5 flex items-center gap-2 text-lg font-black">
                  <Trophy className="h-5 w-5 text-amber-300" />
                  Student Performance Ranking {selectedSubject !== "all" && `— ${selectedSubject}`}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {analyticsData.studentPerformance.slice(0, 6).map((student, index) => (
                    <div key={student.name} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                        <span className={`text-lg font-black ${student.attendance >= 80 ? "text-emerald-300" : student.attendance >= 60 ? "text-amber-300" : "text-rose-300"}`}>
                          {student.attendance}%
                        </span>
                      </div>
                      <h4 className="mb-2 truncate font-bold text-white">{student.name}</h4>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${student.attendance >= 80 ? "bg-emerald-400" : student.attendance >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium text-slate-400">{student.present}/{student.total} days</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search / filters / subject controls */}
        <div id="subjects" className={`${glassCard} mb-8 p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-indigo-400/60"
              >
                <option value="all" className="bg-slate-900">All Students</option>
                <option value="present" className="bg-slate-900">Present Today</option>
                <option value="absent" className="bg-slate-900">Absent Today</option>
                <option value="not_marked" className="bg-slate-900">Not Marked</option>
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-indigo-400/60"
              >
                <option value="all" className="bg-slate-900">All Subjects</option>
                {subjects.map((subject) => {
                  const name = subject.name || subject;
                  return (
                    <option key={name} value={name} className="bg-slate-900">
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={markingSubject}
                onChange={(e) => setMarkingSubject(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-indigo-400/60"
              >
                {subjects.length === 0 && <option value="" className="bg-slate-900">No subjects available</option>}
                {subjects.map((subject) => {
                  const name = subject.name || subject;
                  return (
                    <option key={name} value={name} className="bg-slate-900">
                      {name}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={() => setShowAddSubject(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add Subject
              </button>
              <button
                onClick={markAllPresent}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3.5 py-2.5 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/25"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/15 px-3.5 py-2.5 text-sm font-bold text-rose-300 ring-1 ring-rose-400/20 transition hover:bg-rose-500/25"
              >
                <XCircle className="h-4 w-4" />
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Add Subject Modal */}
        <AnimatePresence>
          {showAddSubject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onClick={() => setShowAddSubject(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`w-full max-w-md ${glassCard} p-6`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-black">
                    <BookOpen className="h-5 w-5 text-indigo-300" />
                    Add New Subject
                  </h3>
                  <button onClick={() => setShowAddSubject(false)} className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Subject Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Subject Code (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. MATH101"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddSubject(false);
                      setNewSubjectName("");
                      setNewSubjectCode("");
                    }}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addSubject}
                    disabled={addingSubject}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                  >
                    {addingSubject && <Loader2 className="h-4 w-4 animate-spin" />}
                    {addingSubject ? "Adding..." : "Add Subject"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Student Management */}
        <div id="students" className={`${glassCard} mb-8 overflow-hidden`}>
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="flex items-center gap-2 text-lg font-black">
              <Users className="h-5 w-5 text-sky-300" />
              Student Management
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Mark attendance and manage your students {markingSubject && `for ${markingSubject}`}
            </p>
          </div>

          <div className="p-6">
            {students.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                  <Users className="h-6 w-6 text-slate-500" />
                </div>
                <h4 className="mt-4 text-sm font-black">No Students Found</h4>
                <p className="mt-1 text-sm font-medium text-slate-400">No students are registered in your class yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-base font-black text-white shadow-lg">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-bold text-white">{student.name}</h4>
                        <p className="truncate text-xs font-medium text-slate-400">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => mark(student._id, "present")}
                        className="flex-1 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/25"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => mark(student._id, "absent")}
                        className="flex-1 rounded-lg bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-300 ring-1 ring-rose-400/20 transition hover:bg-rose-500/25"
                      >
                        Absent
                      </button>
                    </div>

                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Student
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        {subjectFilteredAttendance.length > 0 && (
          <div id="attendance-records" className={`${glassCard} overflow-hidden`}>
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="flex items-center gap-2 text-lg font-black">
                <ClipboardList className="h-5 w-5 text-violet-300" />
                Recent Attendance Records
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-400">Latest attendance entries</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02]">
                  <tr>
                    {["Date", "Student", "Subject", "Status", "Marked By"].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subjectFilteredAttendance.slice(0, 10).map((record) => (
                    <tr key={record._id} className="transition hover:bg-white/[0.03]">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-white">
                        {new Date(record.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-400">{record.student?.name || "N/A"}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-bold text-indigo-300 ring-1 ring-indigo-400/20">
                          {record.subject || "General"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            record.status === "present" ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${record.status === "present" ? "bg-emerald-400" : "bg-rose-400"}`} />
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-400">{record.markedBy?.name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

          </div>
        </main>
      </div>
    </div>
  );
}