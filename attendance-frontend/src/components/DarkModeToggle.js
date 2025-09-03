import React from "react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={() => setDarkMode(!darkMode)}
    >
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {darkMode ? "🌙 Dark" : "☀️ Light"}
      </span>
      <div className="relative w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors">
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
            darkMode ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

