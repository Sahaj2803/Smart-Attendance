import React, { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import AttendanceChart from "../components/AttendanceChart";
import DarkModeToggle from "../components/DarkModeToggle";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
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

        // Fetch attendance
        const response = await API.get("/attendance/my");
        setAttendance(response.data);
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

  const summary = [
    {
      name: "Present",
      value: attendance.filter((a) => a.status === "present").length,
      color: "#10b981"
    },
    {
      name: "Absent",
      value: attendance.filter((a) => a.status === "absent").length,
      color: "#ef4444"
    },
  ];

  const attendanceStats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    percentage: attendance.length > 0 ? Math.round((attendance.filter((a) => a.status === "present").length / attendance.length) * 100) : 0
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfile = () => {
    navigate("/profile");
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
                Loading your dashboard...
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
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
              darkMode ? "text-slate-100" : "text-gray-900"
            }`}>
              Student Dashboard
            </h1>
            <p className={`text-lg font-medium ${
              darkMode ? "text-slate-400" : "text-gray-700"
            }`}>
              Welcome back, {user?.name || "Student"}! Here's your attendance overview.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
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
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Total Days</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{attendanceStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">Present</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{attendanceStats.present}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Absent</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{attendanceStats.absent}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">Percentage</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{attendanceStats.percentage}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Attendance Distribution Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                darkMode ? "text-slate-100" : "text-white"
              }`}>
                📊 Attendance Distribution
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className={`text-sm font-semibold ${
                  darkMode ? "text-slate-400" : "text-white"
                }`}>Present</span>
                <div className="w-3 h-3 bg-red-500 rounded-full ml-4 shadow-sm"></div>
                <span className={`text-sm font-semibold ${
                  darkMode ? "text-slate-400" : "text-white"
                }`}>Absent</span>
              </div>
            </div>
            
            {attendance.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg className="w-8 h-8 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-slate-100" : "text-white"
                }`}>
                  No Data Available
                </h4>
                <p className={`font-medium ${
                  darkMode ? "text-slate-400" : "text-white"
                }`}>
                  No attendance records found.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {summary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Attendance Trend Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className={`text-xl font-bold mb-6 ${
              darkMode ? "text-slate-100" : "text-white"
            }`}>
              📈 Attendance Trend
            </h3>
            {attendance.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <svg className="w-8 h-8 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-slate-100" : "text-slate-900"
                }`}>
                  No Trend Data
                </h4>
                <p className={`font-medium ${
                  darkMode ? "text-slate-400" : "text-white"
                }`}>
                  Attendance trend will appear here once you have records.
                </p>
              </div>
            ) : (
              <AttendanceChart attendanceData={attendance} />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {attendance.length > 0 && (
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className={`text-xl font-bold ${
                darkMode ? "text-slate-100" : "text-white"
              }`}>
                📋 Recent Attendance Records
              </h3>
              <p className={`text-sm font-medium mt-1 ${
                darkMode ? "text-slate-400" : "text-white"
              }`}>
                Your latest attendance entries
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-white"
                    }`}>
                      Date
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-white"
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                      darkMode ? "text-slate-300" : "text-white"
                    }`}>
                      Marked By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {attendance.slice(0, 5).map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        darkMode ? "text-slate-100" : "text-white"
                      }`}>
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          record.status === "present" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 shadow-sm ${
                            record.status === "present" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        darkMode ? "text-slate-400" : "text-white"
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
