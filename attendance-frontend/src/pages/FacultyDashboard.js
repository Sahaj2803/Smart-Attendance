import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import DarkModeToggle from "../components/DarkModeToggle"; // optional toggle switch

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
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

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      API.delete(`/student/${id}`)
        .then(() => {
          alert("Student deleted");
          fetchStudents(); // refresh list
        })
        .catch(() => alert("Failed to delete student"));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      className={`p-6 min-h-screen transition duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 text-black"
      }`}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mark Attendance</h2>
        <div className="space-x-4 flex items-center">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
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

      {/* Student list */}
      <ul className="space-y-3">
        {students.map((s) => (
          <li
            key={s._id}
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <span>
              <strong>{s.name}</strong> ({s.email})
            </span>
            <div className="mt-2 sm:mt-0 space-x-2">
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
                onClick={() => deleteStudent(s._id)}
                className="bg-gray-600 hover:bg-gray-800 text-white px-3 py-1 rounded"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
