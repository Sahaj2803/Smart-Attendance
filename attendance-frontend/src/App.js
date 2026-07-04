// ✅ 1. App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <div className="dark">
      <Router>
        <div className="min-h-screen transition-all bg-gray-100 dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:via-[#16213e] dark:to-[#0f3460] text-gray-900 dark:text-white">
         

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/studentDashboard"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/facultyDashboard"
              element={
                <PrivateRoute allowedRoles={["faculty"]}>
                  <FacultyDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={["student", "faculty"]}>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
