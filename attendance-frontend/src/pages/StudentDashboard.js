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
import { useNavigate } from "react-router-dom"; // ✅ Added for routing
import AttendanceChart from "../components/AttendanceChart";
import DarkModeToggle from "../components/DarkModeToggle";

const COLORS = ["#22c55e", "#ef4444"]; // green + red

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigation

  // Fetch attendance
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

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
          📊 Attendance Dashboard
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* ✅ Profile Page Navigation */}
          <button
            onClick={() => ("/ProfilePage")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow-md transition"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl shadow-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Attendance Summary Chart */}
      <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md shadow-lg p-6 rounded-2xl">
        {loading ? (
          <p className="text-center text-lg animate-pulse">
            Loading attendance...
          </p>
        ) : attendance.length === 0 ? (
          <p className="text-center text-yellow-600 font-medium">
            ⚠ No attendance records found.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary}
                cx="50%"
                cy="50%"
                outerRadius={110}
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
      </div>

      {/* Attendance Trend */}
      <div className="mt-10 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md shadow-lg p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">📈 Attendance Trend</h3>
        <AttendanceChart attendanceData={attendance} />
      </div>
    </div>
  );
}

