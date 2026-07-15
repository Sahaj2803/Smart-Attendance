import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      navigate("/login");
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border py-3 pl-11 pr-4 text-sm font-medium text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
      hasError
        ? "border-rose-500/60 bg-rose-500/5 focus:border-rose-400 focus:ring-rose-500/20"
        : "border-white/10 bg-white/[0.04] focus:border-indigo-400/60 focus:bg-white/[0.06] focus:ring-indigo-500/20"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/25 blur-[120px]"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 -left-32 h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-[120px]"
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
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
            <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-slate-400">Join CampusIQ AI to get started</p>
          </div>

          {errors.general && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
              <p className="text-sm font-semibold text-rose-300">{errors.general}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-400">I am a</label>
            <div className="grid grid-cols-3 gap-2.5">
              {roles.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    form.role === value
                      ? "border-violet-400/60 bg-violet-500/15 text-violet-200 shadow-[0_0_15px_rgba(167,139,250,0.25)]"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Full Name</label>
              <div className="relative">
                <FaUser className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass(errors.name)}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Email Address</label>
              <div className="relative">
                <FaEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass(errors.email)}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Password</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass(errors.password).replace("pr-4", "pr-11")}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">Confirm Password</label>
              <div className="relative">
                <FaLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={inputClass(errors.confirmPassword).replace("pr-4", "pr-11")}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs font-semibold text-rose-400">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Create {form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-indigo-400 transition hover:text-indigo-300">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}