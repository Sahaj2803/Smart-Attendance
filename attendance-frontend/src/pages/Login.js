import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  
  const avatarSrc =
    role === "faculty"
      ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      : "https://cdn-icons-png.flaticon.com/512/921/921347.png";

  const handleLogin = async () => {
    if (!email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/auth/login", { email, password, role });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful`);

      if (role === "faculty") {
        navigate("/facultyDashboard");
      } else {
        navigate("/studentDashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 text-white">
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm text-center">
        {/* Animated Avatar/Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={avatarSrc}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-yellow-300 shadow-lg animate-bounce"
            style={{ background: "white" }}
          />
        </div>
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-white bg-opacity-20 text-black"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-white bg-opacity-20 text-black placeholder-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-white bg-opacity-20 text-black placeholder-gray-700"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow-lg transition"
        >
          Login
        </button>

        <p className="mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-300 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
