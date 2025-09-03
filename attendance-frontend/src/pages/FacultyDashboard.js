import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import DarkModeToggle from "../components/DarkModeToggle";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("Failed to mark attendance");
    }
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
                {students.map((student) => (
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
