import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import { ArrowRight, AlertCircle } from "lucide-react";

const roles = [
  { value: "student", label: "Student", icon: FaGraduationCap },
  { value: "faculty", label: "Faculty", icon: FaChalkboardTeacher },
  { value: "admin", label: "Admin", icon: FaUserShield },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password || !role) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password, role });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      if (role === "faculty") {
        navigate("/facultyDashboard");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/studentDashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

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
          className="absolute bottom-0 -right-32 h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black,transparent)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15 shadow-[0_0_20px_rgba(129,140,248,0.35)]">
            <img src="/campus-logo.png" alt="CampusIQ AI logo" className="h-full w-full rounded-lg object-cover" />
          </div>
          <span className="text-lg font-black tracking-tight">CampusIQ AI</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
              <p className="text-sm font-semibold text-rose-300">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-400">Select Role</label>
            <div className="grid grid-cols-3 gap-2.5">
              {roles.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    role === value
                      ? "border-indigo-400/60 bg-indigo-500/15 text-indigo-200 shadow-[0_0_15px_rgba(129,140,248,0.25)]"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Email Address</label>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Password</label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-11 text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-indigo-400 transition hover:text-indigo-300">
              Create one here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}