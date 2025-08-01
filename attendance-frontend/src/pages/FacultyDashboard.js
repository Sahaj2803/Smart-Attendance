import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import DarkModeToggle from "../components/DarkModeToggle";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
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
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-800 to-blue-600 text-white"
      }`}
    >
      {/* Top bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">🧑‍🏫 Mark Attendance</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          <button
            onClick={() => navigate("/profile")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
          >
            View Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Student list */}
      <ul className="space-y-4">
        {students.map((s) => (
          <li
            key={s._id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-lg shadow-md gap-2 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <span className="text-sm sm:text-base">
              <strong>{s.name}</strong> ({s.email})
            </span>
            <div className="flex gap-2">
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
