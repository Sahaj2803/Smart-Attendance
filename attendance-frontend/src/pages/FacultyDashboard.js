import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import API from "../api";
import DarkModeToggle from "../components/DarkModeToggle";

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
      API.delete(`/auth/student/${id}`)
        .then(() => {
          alert("Student deleted");
          fetchStudents();
        })
        .catch(() => alert("Failed to delete student"));
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
        }
      />

      {/* Faculty Profile Page */}
      <Route
        path="profile"
        element={
          <div
            className={`p-4 sm:p-6 min-h-screen ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">👨‍🏫 Faculty Profile</h2>

            {/* ✅ Back button */}
            <button
              onClick={handleBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded mb-4"
            >
              ⬅ Back
            </button>

            <div className="bg-gray-100 dark:bg-gray-800 shadow p-4 rounded">
              <p><strong>Name:</strong> Prof. Sharma</p>
              <p><strong>Email:</strong> faculty@example.com</p>
              <p><strong>Department:</strong> Computer Science</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
