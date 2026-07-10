import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  Mail,
  BadgeCheck,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Percent,
  ClipboardList,
  BookMarked,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import API from "../api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Faculty: multi-select subjects state
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [savingSubjects, setSavingSubjects] = useState(false);
  const [subjectsNotice, setSubjectsNotice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let resolvedUser = null;
        try {
          const userResponse = await API.get("/auth/me");
          resolvedUser = userResponse.data;
          setUser(resolvedUser);
        } catch (userError) {
          const cached = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(localStorage.getItem("user"));
          if (cached) {
            resolvedUser = cached;
            setUser(cached);
          } else {
            console.error("Failed to load user profile", userError);
            setError("Failed to load user profile");
          }
        }

        try {
          const reportsResponse = await API.get("/attendance/report");
          setReports(reportsResponse.data);
        } catch (reportsError) {
          console.error("Failed to load attendance reports", reportsError);
        }

        if (resolvedUser?.role === "faculty") {
          try {
            const subjectsResponse = await API.get("/subjects");
            setAllSubjects(subjectsResponse.data || []);
            setSelectedSubjectIds((resolvedUser.subjects || []).map((s) => (typeof s === "string" ? s : s._id)));
          } catch (subjectsError) {
            console.error("Failed to load subjects", subjectsError);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    const role = user?.role;
    if (role === "student") navigate("/studentDashboard");
    else if (role === "faculty") navigate("/facultyDashboard");
    else navigate(-1);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const toggleSubject = (id) => {
    setSelectedSubjectIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const saveSubjects = async () => {
    setSavingSubjects(true);
    setSubjectsNotice("");
    try {
      const response = await API.put("/auth/faculty/subjects", { subjectIds: selectedSubjectIds });
      setSubjectsNotice(`Saved ${response.data.subjects?.length || 0} subject(s)`);
    } catch (err) {
      setSubjectsNotice(err.response?.data?.error || "Failed to save subjects");
    } finally {
      setSavingSubjects(false);
      setTimeout(() => setSubjectsNotice(""), 3000);
    }
  };

  const attendanceSummary = {
    total: reports.length,
    present: reports.filter((r) => r.status === "present").length,
    absent: reports.filter((r) => r.status === "absent").length,
    percentage:
      reports.length > 0
        ? Math.round((reports.filter((r) => r.status === "present").length / reports.length) * 100)
        : 0,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),radial-gradient(circle_at_bottom_right,#fee2e2,transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)]">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-500" />
          <h3 className="mt-4 text-lg font-black text-slate-900">Error loading profile</h3>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isFaculty = user?.role === "faculty";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_35%),radial-gradient(circle_at_top_right,#dcfce7,transparent_30%),linear-gradient(135deg,#f8fafc,#eef2ff_55%,#f0fdfa)] pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Profile</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Your academic identity and attendance overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="xl:col-span-1 space-y-6"
          >
            {user && (
              <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 p-7 text-white">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black shadow-inner backdrop-blur-sm ring-2 ring-white/30">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h2 className="text-xl font-black">{user.name || "N/A"}</h2>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold capitalize text-indigo-100">
                        <BadgeCheck className="h-4 w-4" />
                        {user.role || "User"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Email</p>
                      <p className="mt-0.5 break-all text-sm font-bold text-slate-900">{user.email || "Not provided"}</p>
                    </div>
                  </div>

                  {user.department && (
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Department</p>
                        <p className="mt-0.5 text-sm font-bold text-slate-900">{user.department}</p>
                      </div>
                    </div>
                  )}

                  {user.rollNo && (
                    <div className="flex items-start gap-3">
                      <ClipboardList className="mt-0.5 h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Roll No.</p>
                        <p className="mt-0.5 text-sm font-bold text-slate-900">{user.rollNo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Faculty: multi-select subjects */}
            {isFaculty && (
              <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">My Subjects</h3>
                </div>
                <p className="mb-4 text-xs font-medium text-slate-500">
                  Select all the subjects you teach. You can select multiple.
                </p>

                {allSubjects.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-400">
                    No subjects available yet. Add subjects from your dashboard first.
                  </p>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {allSubjects.map((subject) => {
                      const checked = selectedSubjectIds.includes(subject._id);
                      return (
                        <label
                          key={subject._id}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            checked
                              ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                              : "border-slate-100 bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span>
                            {subject.name}
                            {subject.code ? <span className="ml-1 font-medium text-slate-400">({subject.code})</span> : null}
                          </span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-indigo-600"
                            checked={checked}
                            onChange={() => toggleSubject(subject._id)}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={saveSubjects}
                  disabled={savingSubjects || allSubjects.length === 0}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                >
                  {savingSubjects ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {savingSubjects ? "Saving..." : "Save Subjects"}
                </button>
                {subjectsNotice && (
                  <p className="mt-3 text-center text-xs font-bold text-indigo-600">{subjectsNotice}</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-8 xl:col-span-2"
          >
            {/* Stat cards */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-900">
                <CalendarCheck2 className="h-5 w-5 text-indigo-600" />
                Attendance Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Total Days", value: attendanceSummary.total, icon: ClipboardList, tone: "bg-sky-50 text-sky-700 border-sky-100" },
                  { label: "Present", value: attendanceSummary.present, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                  { label: "Absent", value: attendanceSummary.absent, icon: XCircle, tone: "bg-rose-50 text-rose-700 border-rose-100" },
                  { label: "Percentage", value: `${attendanceSummary.percentage}%`, icon: Percent, tone: "bg-violet-50 text-violet-700 border-violet-100" },
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div key={label} className={`rounded-2xl border p-5 ${tone}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
                        <p className="mt-1 text-2xl font-black">{value}</p>
                      </div>
                      <Icon className="h-6 w-6 opacity-60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports table */}
            <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="border-b border-slate-100 px-6 py-5">
                <h3 className="text-lg font-black text-slate-900">Attendance Records</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">Detailed attendance history</p>
              </div>

              <div className="overflow-x-auto">
                {reports.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                      <ClipboardList className="h-6 w-6 text-slate-300" />
                    </div>
                    <h4 className="mt-4 text-sm font-black text-slate-900">No records found</h4>
                    <p className="mt-1 text-sm font-medium text-slate-400">No attendance records available yet.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50/80">
                      <tr>
                        {["Date", "Student", "Status", "Marked By"].map((h) => (
                          <th key={h} className="px-6 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reports.map((r) => (
                        <tr key={r._id} className="transition hover:bg-slate-50/70">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                            {new Date(r.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">{r.student?.name || "N/A"}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                r.status === "present" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${r.status === "present" ? "bg-emerald-500" : "bg-rose-500"}`} />
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">{r.markedBy?.name || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}