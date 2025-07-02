import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AttendanceChart from "../components/AttendanceChart";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Added darkMode state
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/students")
      .then((res) => setStudents(res.data))
      .catch(() => alert("Unauthorized or Failed to load students"));
  }, []);

  const mark = (studentId, status) => {
    API.post("/attendance/mark", { studentId, status })
      .then(() => alert("Attendance Marked"))
      .catch(() => alert("Failed to mark attendance"));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mark Attendance</h2>
        <div className="space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-yellow-400 rounded text-black"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <ul>
        {students.map((s) => (
          <li
            key={s._id}
            className={`mb-2 flex justify-between items-center border p-2 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <span>
              <strong>{s.name}</strong> ({s.email})
            </span>
            <div>
              <button
                onClick={() => mark(s._id, "present")}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
              >
                Present
              </button>
              <button
                onClick={() => mark(s._id, "absent")}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}