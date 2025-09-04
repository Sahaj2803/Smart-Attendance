import React, { useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const avatarSrc = form.role === "faculty"
    ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    : form.role === "admin"
    ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    : "https://cdn-icons-png.flaticon.com/512/921/921347.png";

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (form.password.length < 4) newErrors.password = "Too short";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return toast.error("Please fix form errors");

    try {
      await API.post("/auth/register", form);
      toast.success("Registration Successful 🎉");
      confetti({ particleCount: 100, spread: 60 });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error("Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] flex items-center justify-center">
      <Toaster />
      <motion.div
        className="backdrop-blur-xl bg-white/20 p-6 rounded-xl shadow-2xl border border-white/30 w-full max-w-md"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Tilt glareEnable={true} glareColor="#fff" scale={1.05}>
          <motion.img
            src={avatarSrc}
            alt="Avatar"
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-[0_0_15px_rgb(0,255,255),0_0_30px_rgb(255,0,255)]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </Tilt>

        <h2 className="text-3xl font-bold mb-4 text-center text-white drop-shadow">
          Register
        </h2>

        <div className="mb-2">
          <input
            className="w-full p-2 rounded bg-white/80 text-black"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name}</p>}
        </div>

        <div className="mb-2">
          <input
            className="w-full p-2 rounded bg-white/80 text-black"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <input
            className="w-full p-2 rounded bg-white/80 text-black"
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <select
            className="w-full p-2 rounded bg-white/80 text-black"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <motion.button
          onClick={handleRegister}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2 rounded font-bold shadow-[0_0_10px_#ff00ff,0_0_20px_#00ffff]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>

        <p className="text-center mt-4 text-white">
          Already have an account?{" "}
          <Link to="/login" className="underline font-bold text-yellow-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
