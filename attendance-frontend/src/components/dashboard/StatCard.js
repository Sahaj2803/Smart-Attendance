import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = "from-indigo-500 to-sky-500",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="group rounded-[1.15rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg shadow-slate-200`}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
        <p className="mt-2 min-h-[1.25rem] text-xs font-medium text-slate-400">{helper}</p>
      </div>
    </motion.div>
  );
}
