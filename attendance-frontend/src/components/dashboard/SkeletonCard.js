import React from "react";

export default function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-[1.25rem] border border-white/70 bg-white/80 p-5 shadow-sm ${className}`}>
      <div className="h-4 w-28 rounded-full bg-slate-200" />
      <div className="mt-5 h-8 w-40 rounded-full bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
