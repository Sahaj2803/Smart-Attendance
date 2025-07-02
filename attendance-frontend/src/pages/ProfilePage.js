import React, { useEffect, useState } from "react";
import API from "../api";

export default function ProfilePage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/attendance/report")
      .then((res) => setReports(res.data))
      .catch((err) => {
        console.error("❌ Failed to load attendance reports", err);
        alert("Error loading reports");
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Attendance Report</h2>
      <table className="w-full text-white">
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
            <tr key={r._id} className="border-b border-gray-400">
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
