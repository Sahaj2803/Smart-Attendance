import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (try both keys)
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      setUser(userInfo);
    } else {
      // If no user info, try to fetch from API
      API.get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("❌ Failed to load user profile", err);
        });
    }

    // Get attendance reports
    API.get("/attendance/report")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("❌ Failed to load attendance reports", err);
        alert("Error loading reports");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    const userRole = user?.role;
    if (userRole === "student") {
      navigate("/studentDashboard");
    } else if (userRole === "faculty") {
      navigate("/facultyDashboard");
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Calculate attendance summary
  const attendanceSummary = {
    total: reports.length,
    present: reports.filter(r => r.status === "present").length,
    absent: reports.filter(r => r.status === "absent").length,
    percentage: reports.length > 0 ? Math.round((reports.filter(r => r.status === "present").length / reports.length) * 100) : 0
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <p className="text-lg animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
          👤 User Profile & Reports
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            ⬅ Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 max-w-2xl">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold">{user.name || "N/A"}</h3>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {user.role || "User"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <p className="text-lg">{user.name || "Not provided"}</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <p className="text-lg">{user.email || "Not provided"}</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <p className="text-lg capitalize">{user.role || "Not specified"}</p>
            </div>

            {user.department && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <p className="text-lg">{user.department}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Summary */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">📊 Attendance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {attendanceSummary.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {attendanceSummary.present}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {attendanceSummary.absent}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {attendanceSummary.percentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attendance</div>
          </div>
        </div>
      </div>

      {/* Attendance Reports Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">📋 Attendance Reports</h3>
        {reports.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No attendance records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-gray-900 dark:text-white">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Marked By</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-3">{r.student?.name || "N/A"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "present" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">{r.markedBy?.name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

