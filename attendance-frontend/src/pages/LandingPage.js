import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";
import StudentAvatar from "../components/StudentAvatar";
import FacultyAvatar from "../components/FacultyAvatar";
import AdminAvatar from "../components/AdminAvatar";

const roleCards = [
  {
    key: "student",
    title: "Student",
    description: "Track attendance, subjects, timetable, and get AI-powered study guidance.",
    Avatar: StudentAvatar,
    accent: "from-sky-500/20 to-indigo-500/20",
    ring: "group-hover:ring-sky-400/60",
    button: "bg-sky-500 hover:bg-sky-400",
  },
  {
    key: "faculty",
    title: "Faculty",
    description: "Mark attendance, manage subjects, and monitor class performance in real time.",
    Avatar: FacultyAvatar,
    accent: "from-emerald-500/20 to-teal-500/20",
    ring: "group-hover:ring-emerald-400/60",
    button: "bg-emerald-500 hover:bg-emerald-400",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-sky-500/20 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-emerald-500/15 blur-[120px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-6 py-14">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-300 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          AI-powered campus attendance platform
        </motion.div>

        {/* Logo */}
        <motion.img
          src="/logo.png"
          alt="SP Logo"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 h-24 w-24 rounded-3xl object-cover shadow-[0_0_60px_rgba(99,102,241,0.35)] md:h-28 md:w-28"
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-4xl font-black leading-tight tracking-tight md:text-6xl"
        >
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Smart Attendance
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl text-center text-base text-slate-400 md:text-lg"
        >
          One workspace for attendance, subjects, and AI guidance — built for students, faculty, and admins.
        </motion.p>

        {/* Role cards */}
        <div className="mt-14 grid w-full gap-6 sm:grid-cols-2">
          {roleCards.map(({ key, title, description, Avatar, accent, ring, button }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${ring}`}
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Avatar />
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                <div className="mt-6 flex w-full gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg transition ${button}`}
                  >
                    Login
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:bg-white/10"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 flex w-full items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl sm:px-8"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-400/20">
              <AdminAvatar />
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-black text-violet-200">
                <ShieldCheck className="h-4 w-4" />
                Administrator
              </p>
              <p className="text-xs text-slate-400">Manage users, subjects, and platform-wide oversight.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-500"
          >
            Admin Login
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Footer trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          <GraduationCap className="h-4 w-4" />
          Trusted by classrooms for real-time attendance intelligence
        </motion.div>
      </div>
    </div>
  );
}