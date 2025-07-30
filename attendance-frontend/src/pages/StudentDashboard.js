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
import { useNavigate } from "react-router-dom";
import AttendanceChart from "../components/AttendanceChart"; 

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

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen p-6"
          : "bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen p-6"
      }
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Your Attendance Chart</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-yellow-400 rounded text-black"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={() => navigate("/profile")}
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

      {loading ? (
        <p className="text-center text-lg">Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p className="text-center text-yellow-200">No attendance data found.</p>
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

      {/* AttendanceChart component yahan add karein */}
      
    <div className="mt-8">
      <AttendanceChart attendanceData={attendance} />
    </div>

    </div>
  );
}
