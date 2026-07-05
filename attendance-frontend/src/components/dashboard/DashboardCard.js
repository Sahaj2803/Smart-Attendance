import React from "react";
import { motion } from "framer-motion";

export default function DashboardCard({
  children,
  className = "",
  delay = 0,
  as: Component = motion.section,
  ...props
}) {
  return (
    <Component
      {...props}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={`rounded-[1.35rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </Component>
  );
}
