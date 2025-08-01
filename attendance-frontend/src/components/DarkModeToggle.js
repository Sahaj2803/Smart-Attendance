import React from "react";
import { motion } from "framer-motion";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => setDarkMode(!darkMode)}
    >
      <span className="text-sm">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>
      <div className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-white"
          animate={{ x: darkMode ? 24 : 0 }}
        />
      </div>
    </div>
  );
}

