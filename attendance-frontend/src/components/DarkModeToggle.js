import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors bg-white text-black dark:bg-black dark:text-white"
    >
      {darkMode ? (
        <>
          <Sun className="text-yellow-400" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="text-blue-800" />
          <span>Dark Mode</span>
        </>
      )}
    </motion.button>
  );
}
