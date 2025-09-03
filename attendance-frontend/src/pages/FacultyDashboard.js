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
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    API.get("/auth/students")
      .then((res) => setStudents(res.data))
      .catch(() => alert("Unauthorized or Failed to load students"));
  };

  const mark = (studentId, status) => {
    API.post("/attendance/mark", { studentId, status })
      .then(() => alert("Attendance Marked"))
      .catch(() => alert("Failed to mark attendance"));
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

  // ✅ Back button handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/faculty-dashboard", { replace: true });
    }
  };

  return (
    <Routes>
      {/* Faculty Dashboard */}
      <Route
        path="/"
        element={
          <div
            className={`p-4 sm:p-6 min-h-screen transition duration-300 ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-white text-black"
            }`}
          >
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">Mark Attendance</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <button
                  onClick={() => navigate("/ProfilePage")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded w-full sm:w-auto"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded w-full sm:w-auto"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Student list */}
            <ul className="space-y-3">
              {students.map((s) => (
                <li
                  key={s._id}
                  className={`flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center border p-4 rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-black"
                  }`}
                >
                  <div>
                    <p className="font-semibold capitalize">{s.name}</p>
                    <p className="text-sm text-gray-400">{s.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => mark(s._id, "present")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => mark(s._id, "absent")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="w-full mt-3 bg-slate-500 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      🗑️ Delete Student
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
