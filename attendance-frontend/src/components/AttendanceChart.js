import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const AttendanceChart = ({ attendanceData }) => {
  const chartRef = React.useRef();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Filter attendance by date range
  const filteredAttendance = attendanceData.filter((entry) => {
    if (!fromDate && !toDate) return true;
    const entryDate = new Date(entry.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && entryDate < from) return false;
    if (to && entryDate > to) return false;
    return true;
  });

  const generatePDF = () => {
    html2canvas(chartRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0, 200, 0);
      pdf.save('attendance-chart.pdf');
    });
  };

  const downloadCSV = () => {
    const csvData = filteredAttendance.map(entry => ({
      Date: entry.date,
      Status: entry.status,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'attendance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div
      ref={chartRef}
      className="bg-white bg-opacity-10 rounded-xl p-6 shadow-lg max-w-xl mx-auto"
    >
      <h1 className="text-xl font-bold mb-4 text-center">Your Attendance Chart</h1>
      {/* Date Range Filter */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
        <label className="flex items-center gap-2">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="rounded px-2 py-1 border border-gray-300"
          />
        </label>
        <label className="flex items-center gap-2">
          To:
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="rounded px-2 py-1 border border-gray-300"
          />
        </label>
      </div>
      {/* Attendance Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white bg-opacity-80 rounded shadow text-gray-900">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((entry, idx) => {
                // Show original date string
                return (
                  <tr key={idx} className="hover:bg-indigo-100 transition">
                    <td className="py-2 px-4 border-b">{entry.date}</td>
                    <td
                      className={`py-2 px-4 border-b font-semibold ${
                        entry.status === 'Present'
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {entry.status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Animated Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={generatePDF}
          className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition transform hover:scale-105 active:scale-95 duration-150"
        >
          📄 Download PDF
        </button>
        <button
          onClick={downloadCSV}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition transform hover:scale-105 active:scale-95 duration-150"
        >
          📥 Download CSV
        </button>
      </div>
    </div>
  );
};

export default AttendanceChart;