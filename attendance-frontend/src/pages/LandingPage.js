import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  BrainCircuit,
  ShieldCheck,
  Layers,
  Github,
  BarChart3,
  Moon,
} from "lucide-react";
import StudentAvatar from "../components/StudentAvatar";
import FacultyAvatar from "../components/FacultyAvatar";
import AdminAvatar from "../components/AdminAvatar";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Tech Stack", href: "#stack" },
];

const featurePills = [
  { icon: ClipboardCheck, title: "Smart Attendance", subtitle: "Subject-wise tracking", tone: "bg-violet-500/15 text-violet-300" },
  { icon: BrainCircuit, title: "AI Doubt Assistant", subtitle: "Gemini-powered", tone: "bg-emerald-500/15 text-emerald-300" },
  { icon: ShieldCheck, title: "Secure & Reliable", subtitle: "JWT authentication", tone: "bg-sky-500/15 text-sky-300" },
  { icon: Layers, title: "Role-based Access", subtitle: "Student · Faculty · Admin", tone: "bg-amber-500/15 text-amber-300" },
  { icon: Moon, title: "Dark Mode Ready", subtitle: "Built for late nights", tone: "bg-rose-500/15 text-rose-300" },
];

const solutions = [
  { key: "student", title: "Student", Avatar: StudentAvatar, description: "Track attendance, subjects, timetable, and get AI-powered study guidance.", accent: "from-sky-500/20 to-indigo-500/20", button: "bg-sky-500 hover:bg-sky-400" },
  { key: "faculty", title: "Faculty", Avatar: FacultyAvatar, description: "Mark attendance, manage subjects, and monitor class performance in real time.", accent: "from-emerald-500/20 to-teal-500/20", button: "bg-emerald-500 hover:bg-emerald-400" },
];

const techStack = ["React", "Node.js", "Express", "MongoDB Atlas", "Tailwind CSS", "Gemini AI", "JWT Auth", "Framer Motion"];

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[130px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -right-32 h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,black,transparent)]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15 shadow-[0_0_20px_rgba(129,140,248,0.35)]">
            <img src="/campus-logo.png" alt="CampusIQ AI logo" className="h-full w-full rounded-lg object-cover" />
          </div>
          <span className="text-lg font-black tracking-tight">CampusIQ AI</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => scrollTo(link.href.slice(1))} className="transition hover:text-white">
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="hidden text-sm font-bold text-slate-300 transition hover:text-white sm:inline-block">
            Sign in
          </button>
          <button
            onClick={() => navigate("/register")}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:opacity-90"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-10 pt-8 text-center md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-300 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          AI-Powered Campus Attendance Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl"
        >
          <span className="text-white">Smarter Campus.</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
            Better Future.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg"
        >
          CampusIQ AI is an AI-powered campus attendance platform built with the MERN stack.
          Automate attendance, get AI study guidance, and simplify campus operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => scrollTo("solutions")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-900/50 transition hover:opacity-90"
          >
            Live Demo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo("stack")}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-slate-100 backdrop-blur-xl transition hover:bg-white/10"
          >
            <Github className="h-4 w-4" />
            Tech Stack
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {featurePills.map(({ icon: Icon, title, subtitle, tone }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left backdrop-blur-xl"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:p-6"
        >
          <div className="flex items-center gap-1.5 pb-4">
            <span className="h-3 w-3 rounded-full bg-rose-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Students", value: "1,248", tone: "text-violet-300" },
              { label: "Present Today", value: "982", tone: "text-emerald-300" },
              { label: "Attendance Rate", value: "78.8%", tone: "text-sky-300" },
              { label: "Total Classes", value: "56", tone: "text-amber-300" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left">
                <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                <p className={`mt-2 text-2xl font-black ${stat.tone}`}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left sm:col-span-2">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <BarChart3 className="h-4 w-4 text-violet-300" />
                  Attendance Overview
                </p>
              </div>
              <div className="mt-4 flex h-24 items-end gap-2">
                {[40, 60, 55, 75, 65, 80, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-500/60 to-violet-400/60" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Sparkles className="h-4 w-4 text-amber-300" />
                AI Insights
              </p>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Attendance is 15% higher on Mondays. Computer Science students have the highest attendance rate.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Solutions / role selection */}
      <section id="solutions" className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Built for everyone on campus</h2>
          <p className="mt-3 text-slate-400">One workspace for attendance, subjects, and AI guidance.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {solutions.map(({ key, title, Avatar, description, accent, button }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl sm:px-8"
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
      </section>

      {/* Tech stack */}
      <section id="stack" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">Powered by the MERN stack</h2>
          <p className="mt-2 text-slate-400">Built with modern, production-ready technology.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-semibold text-slate-300 backdrop-blur-xl"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        Built with CampusIQ AI — Smart Attendance Platform
      </footer>
    </div>
  );
}