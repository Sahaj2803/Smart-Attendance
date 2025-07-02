import React from "react";
import { useNavigate } from "react-router-dom";
import StudentAvatar from "../components/StudentAvatar";
import FacultyAvatar from "../components/FacultyAvatar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white text-center px-4">
      {/* SP Logo */}
      <img
        src="/logo.png"
        alt="SP Logo"
        className="w-40 h-40 animate-bounce drop-shadow-xl mb-8"
      />

      {/* Avatar and buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl">
        
        {/* Student Avatar */}
        <div className="hidden md:flex flex-col items-center mx-4">
          <StudentAvatar />
          <p className="mt-4 text-lg font-medium">Student</p>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold">Smart Attendance</h1>
          <p className="text-gray-300">Login or Register to continue</p>
          <div className="space-x-4">
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

        {/* Faculty Avatar */}
        <div className="hidden md:flex flex-col items-center mx-4">
          <FacultyAvatar />
          <p className="mt-4 text-lg font-medium">Faculty</p>
        </div>
      </div>
    </div>
  );
}
