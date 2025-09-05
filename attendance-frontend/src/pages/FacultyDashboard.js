import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import DarkModeToggle from "../components/DarkModeToggle";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user info
        const userInfo = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
        if (userInfo) {
          setUser(userInfo);
        }

        // Fetch students and attendance data
        const [studentsResponse, attendanceResponse] = await Promise.all([
          API.get("/auth/students"),
          API.get("/attendance/report")
        ]);
        
        setStudents(studentsResponse.data);
        setAttendance(attendanceResponse.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dark mode class on HTML element and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const mark = async (studentId, status) => {
    try {
      await API.post("/attendance/mark", { studentId, status });
      // Refresh data after marking
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report")
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      
      // Show notification
      addNotification(`Attendance marked as ${status}`, "success");
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      addNotification("Failed to mark attendance", "error");
    }
  };

  const markAllPresent = async () => {
    try {
      const promises = students.map(student => 
        API.post("/attendance/mark", { studentId: student._id, status: "present" })
      );
      await Promise.all(promises);
      
      // Refresh data
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report")
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      
      addNotification("All students marked present", "success");
    } catch (err) {
      console.error("Failed to mark all present:", err);
      addNotification("Failed to mark all present", "error");
    }
  };

  const markAllAbsent = async () => {
    try {
      const promises = students.map(student => 
        API.post("/attendance/mark", { studentId: student._id, status: "absent" })
      );
      await Promise.all(promises);
      
      // Refresh data
      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/auth/students"),
        API.get("/attendance/report")
      ]);
      setStudents(studentsResponse.data);
      setAttendance(attendanceResponse.data);
      
      addNotification("All students marked absent", "success");
    } catch (err) {
      console.error("Failed to mark all absent:", err);
      addNotification("Failed to mark all absent", "error");
    }
  };

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await API.delete(`/auth/student/${id}`);
        setStudents(students.filter(s => s._id !== id));
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

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    totalAttendance: attendance.length,
    presentToday: attendance.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString() && 
      a.status === "present"
    ).length,
    absentToday: attendance.filter(a => 
      new Date(a.date).toDateString() === new Date().toDateString() && 
      a.status === "absent"
    ).length
  };

  // Filter students based on search and filter
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    
    // Check if student has attendance today
    const todayAttendance = attendance.find(a => 
      a.student?._id === student._id && 
      new Date(a.date).toDateString() === new Date().toDateString()
    );
    
    if (filterStatus === "present") return matchesSearch && todayAttendance?.status === "present";
    if (filterStatus === "absent") return matchesSearch && todayAttendance?.status === "absent";
    if (filterStatus === "not_marked") return matchesSearch && !todayAttendance;
    
    return matchesSearch;
  });

  // Enhanced Analytics Data with Real Calculations
  const getWeeklyTrend = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      
      const dayAttendance = attendance.filter(a => {
        if (!a.date) return false;
        const attendanceDate = new Date(a.date);
        return attendanceDate.toDateString() === date.toDateString();
      });
      
      const present = dayAttendance.filter(a => a.status === "present").length;
      const absent = dayAttendance.filter(a => a.status === "absent").length;
      const total = present + absent;
      
      return {
        day,
        present: present || 0,
        absent: absent || 0,
        total: total || 0,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0
      };
    });
  };

  const getDailyUpdates = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const todayAttendance = attendance.filter(a => {
      if (!a.date) return false;
      return new Date(a.date).toDateString() === today.toDateString();
    });
    
    const yesterdayAttendance = attendance.filter(a => {
      if (!a.date) return false;
      return new Date(a.date).toDateString() === yesterday.toDateString();
    });
    
    const todayPresent = todayAttendance.filter(a => a.status === "present").length;
    const todayAbsent = todayAttendance.filter(a => a.status === "absent").length;
    const yesterdayPresent = yesterdayAttendance.filter(a => a.status === "present").length;
    const yesterdayAbsent = yesterdayAttendance.filter(a => a.status === "absent").length;
    
    const todayTotal = todayPresent + todayAbsent;
    const yesterdayTotal = yesterdayPresent + yesterdayAbsent;
    
    const presentChange = yesterdayPresent > 0 ? 
      Math.round(((todayPresent - yesterdayPresent) / yesterdayPresent) * 100) : 
      todayPresent > 0 ? 100 : 0;
    const absentChange = yesterdayAbsent > 0 ? 
      Math.round(((todayAbsent - yesterdayAbsent) / yesterdayAbsent) * 100) : 
      todayAbsent > 0 ? 100 : 0;
    
    return {
      today: {
        present: todayPresent || 0,
        absent: todayAbsent || 0,
        total: todayTotal || 0,
        percentage: todayTotal > 0 ? 
          Math.round((todayPresent / todayTotal) * 100) : 0
      },
      yesterday: {
        present: yesterdayPresent || 0,
        absent: yesterdayAbsent || 0,
        total: yesterdayTotal || 0,
        percentage: yesterdayTotal > 0 ? 
          Math.round((yesterdayPresent / yesterdayTotal) * 100) : 0
      },
      changes: {
        present: presentChange || 0,
        absent: absentChange || 0
      }
    };
  };

  const analyticsData = {
    attendanceDistribution: [
      { name: "Present", value: attendance.filter(a => a.status === "present").length || 0, color: "#10b981" },
      { name: "Absent", value: attendance.filter(a => a.status === "absent").length || 0, color: "#ef4444" }
    ],
    weeklyTrend: getWeeklyTrend(),
    dailyUpdates: getDailyUpdates(),
    studentPerformance: students.map(student => {
      const studentAttendance = attendance.filter(a => a.student?._id === student._id);
      const presentCount = studentAttendance.filter(a => a.status === "present").length;
      const totalCount = studentAttendance.length;
      const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
      
      return {
        name: student.name || "Unknown Student",
        attendance: percentage || 0,
        present: presentCount || 0,
        total: totalCount || 0
      };
    }).sort((a, b) => b.attendance - a.attendance)
  };

  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-slate-900 to-slate-800" 
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className={`text-lg font-medium ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                Loading faculty dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-slate-900 to-slate-800" 
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}>
                Error Loading Dashboard
              </h3>
              <p className={`mb-6 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-slate-900 to-slate-800" 
        : "bg-gradient-to-br from-slate-50 to-slate-100"
    }`}>
      {/* Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ${
              notification.type === "success"
                ? "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-slate-100" : "text-slate-900"
            }`}>
              Faculty Dashboard
            </h1>
            <p className={`text-lg ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>
              Welcome back, {user?.name || "Professor"}! Manage your students and attendance.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors font-medium shadow-sm ${
                showAnalytics 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            <button
              onClick={handleProfile}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Present Today</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.presentToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-200 dark:border-red-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Absent Today</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.absentToday}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total Records</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalAttendance}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Section */}
        {showAnalytics && (
          <div className="mb-8 space-y-8">
            {/* Daily Updates Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className={`text-xl font-semibold mb-6 ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}>
                📅 Daily Attendance Update
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Today's Stats */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Today's Attendance</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {analyticsData.dailyUpdates.today.percentage}%
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {analyticsData.dailyUpdates.today.present} present, {analyticsData.dailyUpdates.today.absent} absent
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Yesterday's Stats */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Yesterday's Attendance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {analyticsData.dailyUpdates.yesterday.percentage}%
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {analyticsData.dailyUpdates.yesterday.present} present, {analyticsData.dailyUpdates.yesterday.absent} absent
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Present Change */}
                <div className={`p-6 rounded-xl border ${
                  analyticsData.dailyUpdates.changes.present >= 0 
                    ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
                    : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        analyticsData.dailyUpdates.changes.present >= 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        Present Change
                      </p>
                      <p className={`text-2xl font-bold ${
                        analyticsData.dailyUpdates.changes.present >= 0 
                          ? "text-green-900 dark:text-green-100" 
                          : "text-red-900 dark:text-red-100"
                      }`}>
                        {analyticsData.dailyUpdates.changes.present >= 0 ? '+' : ''}{analyticsData.dailyUpdates.changes.present}%
                      </p>
                      <p className={`text-xs ${
                        analyticsData.dailyUpdates.changes.present >= 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        vs yesterday
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      analyticsData.dailyUpdates.changes.present >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                          analyticsData.dailyUpdates.changes.present >= 0 
                            ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                            : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        } />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Absent Change */}
                <div className={`p-6 rounded-xl border ${
                  analyticsData.dailyUpdates.changes.absent <= 0 
                    ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800"
                    : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        analyticsData.dailyUpdates.changes.absent <= 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        Absent Change
                      </p>
                      <p className={`text-2xl font-bold ${
                        analyticsData.dailyUpdates.changes.absent <= 0 
                          ? "text-green-900 dark:text-green-100" 
                          : "text-red-900 dark:text-red-100"
                      }`}>
                        {analyticsData.dailyUpdates.changes.absent >= 0 ? '+' : ''}{analyticsData.dailyUpdates.changes.absent}%
                      </p>
                      <p className={`text-xs ${
                        analyticsData.dailyUpdates.changes.absent <= 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        vs yesterday
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      analyticsData.dailyUpdates.changes.absent <= 0 ? "bg-green-500" : "bg-red-500"
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                          analyticsData.dailyUpdates.changes.absent <= 0 
                            ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                            : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        } />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Attendance Distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className={`text-xl font-semibold mb-6 ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  📊 Overall Attendance Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.attendanceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {analyticsData.attendanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} students`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Weekly Trend */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className={`text-xl font-semibold mb-6 ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  📈 Weekly Attendance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'present') {
                          return [`${value} students`, 'Present'];
                        } else if (name === 'absent') {
                          return [`${value} students`, 'Absent'];
                        } else if (name === 'percentage') {
                          return [`${value}%`, 'Attendance %'];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Day: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="present" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Present"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="absent" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      name="Absent"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Attendance %"
                      strokeDasharray="5 5"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {analyticsData.weeklyTrend.map((day, index) => (
                    <div key={day.day} className="text-center">
                      <div className={`text-xs font-medium ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                        {day.day}
                      </div>
                      <div className={`text-sm font-bold ${
                        day.percentage >= 80 ? "text-green-600" :
                        day.percentage >= 60 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {day.percentage}%
                      </div>
                      <div className={`text-xs ${
                        darkMode ? "text-slate-500" : "text-slate-500"
                      }`}>
                        {day.total} total
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className={`text-xl font-semibold mb-6 ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}>
                🏆 Student Performance Ranking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.studentPerformance.slice(0, 6).map((student, index) => (
                  <div key={student.name} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        darkMode ? "text-slate-300" : "text-slate-600"
                      }`}>
                        #{index + 1}
                      </span>
                      <span className={`text-lg font-bold ${
                        student.attendance >= 80 ? "text-green-600" : 
                        student.attendance >= 60 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {student.attendance}%
                      </span>
                    </div>
                    <h4 className={`font-semibold mb-1 ${
                      darkMode ? "text-slate-100" : "text-slate-900"
                    }`}>
                      {student.name}
                    </h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          student.attendance >= 80 ? "bg-green-500" : 
                          student.attendance >= 60 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {student.present}/{student.total} days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" 
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-slate-100" 
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="all">All Students</option>
                <option value="present">Present Today</option>
                <option value="absent">Absent Today</option>
                <option value="not_marked">Not Marked</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="inline-flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Student Management Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className={`text-xl font-semibold ${
              darkMode ? "text-slate-100" : "text-slate-900"
            }`}>
              👥 Student Management
            </h3>
            <p className={`text-sm mt-1 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>
              Mark attendance and manage your students
            </p>
          </div>
          
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-medium mb-2 ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  No Students Found
                </h4>
                <p className={`${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  No students are registered in your class yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h4 className={`font-semibold ${
                          darkMode ? "text-slate-100" : "text-slate-900"
                        }`}>
                          {student.name}
                        </h4>
                        <p className={`text-sm ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                          {student.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => mark(student._id, "present")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => mark(student._id, "absent")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        ✗ Absent
                      </button>
                    </div>
                    
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="w-full mt-3 bg-slate-500 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      🗑️ Delete Student
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Attendance Records */}
        {attendance.length > 0 && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className={`text-xl font-semibold ${
                darkMode ? "text-slate-100" : "text-slate-900"
              }`}>
                📋 Recent Attendance Records
              </h3>
              <p className={`text-sm mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}>
                Latest attendance entries
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>
                      Date
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>
                      Student
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-slate-600"
                    }`}>
                      Marked By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {attendance.slice(0, 10).map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        darkMode ? "text-slate-100" : "text-slate-900"
                      }`}>
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                        {record.student?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            record.status === "present" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                        {record.markedBy?.name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
