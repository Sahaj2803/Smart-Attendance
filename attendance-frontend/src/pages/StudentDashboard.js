import React, { useEffect, useState } from "react";
import API from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate, Routes, Route } from "react-router-dom";
import AttendanceChart from "../components/AttendanceChart";
import DarkModeToggle from "../components/DarkModeToggle"; 

const COLORS = ["#00C49F", "#FF8042"];

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/attendance/my")
      .then((res) => {
        setAttendance(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Attendance fetch error:", err);
        alert("Unauthorized or failed to fetch attendance");
        setLoading(false);
      });
  }, []);

  const summary = [
    {
      name: "Present",
      value: attendance.filter((a) => a.status === "present").length,
    },
    {
      name: "Absent",
      value: attendance.filter((a) => a.status === "absent").length,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Back button handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/student-dashboard", { replace: true });
    }
  };

  return (
    <Routes>
      {/* ✅ Dashboard Page */}
      <Route
        path="/"
        element={
          <div
            className={
              darkMode
                ? "bg-gray-900 text-white min-h-screen p-4 sm:p-6"
                : "bg-white text-gray-900 min-h-screen p-4 sm:p-6"
            }
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">
                📊 Your Attendance Chart
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

                <button
                  onClick={() => navigate("profile")}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                >
                  View Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Attendance Chart */}
            {loading ? (
              <p className="text-center text-lg">Loading attendance...</p>
            ) : attendance.length === 0 ? (
              <p className="text-center text-yellow-600">
                No attendance data found.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {summary.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Attendance Trend */}
            <div className="mt-8">
              <AttendanceChart attendanceData={attendance} />
            </div>
          </div>
        }
      />

      {/* ✅ Profile Page */}
      <Route
        path="profile"
        element={
          <div
            className={
              darkMode
                ? "bg-gray-900 text-white min-h-screen p-4 sm:p-6"
                : "bg-white text-gray-900 min-h-screen p-4 sm:p-6"
            }
          >
            <h2 className="text-2xl font-bold mb-4">👤 Student Profile</h2>

            <button
              onClick={handleBack}
              className="bg-indigo-500 hover:bg-indigo-700 text-white px-3 py-1 rounded mb-4"
            >
              ⬅ Back
            </button>

            <div className="bg-gray-100 dark:bg-gray-800 shadow p-4 rounded">
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john@example.com</p>
              <p><strong>Roll No:</strong> 123456</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
