import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaGraduationCap, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Handle dark mode class on HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case "faculty":
        return <FaChalkboardTeacher className="w-5 h-5" />;
      case "admin":
        return <FaUserShield className="w-5 h-5" />;
      default:
        return <FaGraduationCap className="w-5 h-5" />;
    }
  };

  const getRoleColor = (roleType) => {
    switch (roleType) {
      case "faculty":
        return "from-blue-500 to-blue-600";
      case "admin":
        return "from-purple-500 to-purple-600";
      default:
        return "from-green-500 to-green-600";
    }
  };

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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          darkMode ? "bg-blue-500" : "bg-indigo-500"
        } blur-3xl`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          darkMode ? "bg-purple-500" : "bg-purple-500"
        } blur-3xl`}></div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            darkMode 
              ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" 
              : "bg-white text-slate-600 hover:bg-gray-50"
          } shadow-lg hover:shadow-xl`}
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-500 ${
          darkMode 
            ? "bg-slate-800/90 backdrop-blur-xl border border-slate-700" 
            : "bg-white/90 backdrop-blur-xl border border-white/20"
        } rounded-3xl shadow-2xl p-8 sm:p-10`}>
          
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo/Icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-500 ${
              darkMode ? "bg-slate-700" : "bg-gradient-to-br from-indigo-500 to-purple-600"
            }`}>
              <div className={`text-3xl transition-colors duration-300 ${
                darkMode ? "text-indigo-400" : "text-white"
              }`}>
                {getRoleIcon(role)}
              </div>
            </div>
            
            <h1 className={`text-3xl sm:text-4xl font-bold mb-2 transition-colors duration-300 ${
              darkMode ? "text-slate-100" : "text-slate-900"
            }`}>
              Welcome Back
            </h1>
            <p className={`text-sm transition-colors duration-300 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}>
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "student", label: "Student", icon: <FaGraduationCap className="w-4 h-4" /> },
                { value: "faculty", label: "Faculty", icon: <FaChalkboardTeacher className="w-4 h-4" /> },
                { value: "admin", label: "Admin", icon: <FaUserShield className="w-4 h-4" /> }
              ].map((roleOption) => (
                <button
                  key={roleOption.value}
                  onClick={() => setRole(roleOption.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    role === roleOption.value
                      ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300`
                      : `border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 ${
                          darkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-600 hover:text-slate-700"
                        }`
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {roleOption.icon}
                    <span className="text-xs font-medium">{roleOption.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                Email Address
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" 
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}>
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  <FaLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400" 
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    darkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                  } transition-colors duration-300`}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full mt-8 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              loading 
                ? "bg-slate-400 cursor-not-allowed" 
                : `bg-gradient-to-r ${getRoleColor(role)} hover:shadow-lg focus:ring-indigo-500`
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
            )}
          </button>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className={`text-sm transition-colors duration-300 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}>
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-300"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
