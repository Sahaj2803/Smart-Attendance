import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom"; // ✅ Navigation import kiya

export default function ProfilePage() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // ✅ Navigation hook

  useEffect(() => {
    API.get("/attendance/report")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("❌ Failed to load attendance reports", err);
        alert("Error loading reports");
      });
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* ✅ Back Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Attendance Report</h2>
        <button
          onClick={() => navigate(-1)} // ✅ Back to previous page
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          ⬅ Back
        </button>
      </div>

      <table className="w-full text-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="p-2">Date</th>
            <th className="p-2">Student</th>
            <th className="p-2">Status</th>
            <th className="p-2">Marked By</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
              <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-2">{r.student?.name || "N/A"}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">{r.markedBy?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

