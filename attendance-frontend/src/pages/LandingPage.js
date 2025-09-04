import React from "react";
import { useNavigate } from "react-router-dom";
import StudentAvatar from "../components/StudentAvatar";
import FacultyAvatar from "../components/FacultyAvatar";
import AdminAvatar from "../components/AdminAvatar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      {/* SP Logo */}
      <img
        src="/logo.png"
        alt="SP Logo"
        className="w-32 h-32 md:w-40 md:h-40 animate-bounce drop-shadow-xl mb-6 md:mb-8"
      />

      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-8 md:gap-12">
        
        {/* Student Avatar (Mobile & Desktop both) */}
        <div className="flex flex-col items-center mx-4">
          <StudentAvatar />
          <p className="mt-3 text-lg font-medium">Student</p>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Smart Attendance</h1>
          <p className="text-gray-300 text-sm md:text-base">
            Login or Register to continue
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold shadow-md"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold shadow-md"
            >
              Register
            </button>
          </div>
        </div>

        {/* Faculty Avatar (Mobile & Desktop both) */}
        <div className="flex flex-col items-center mx-4">
          <FacultyAvatar />
          <p className="mt-3 text-lg font-medium">Faculty</p>
        </div>
      </div>

      {/* Admin Section */}
      <div className="mt-8 text-center">
        <div className="flex flex-col items-center">
          <AdminAvatar />
          <p className="mt-3 text-lg font-medium text-purple-300">Administrator</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold shadow-md mt-2"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

