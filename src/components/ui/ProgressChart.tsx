"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressChartProps {
  percentage: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function ProgressChart({ 
  percentage, 
  className, 
  size = 200, 
  strokeWidth = 16 
}: ProgressChartProps) {
  const radius = size / 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = percentage < 60 ? "text-red-500" : percentage < 85 ? "text-orange-500" : "text-green-500";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-100"
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={cn("drop-shadow-sm", colorClass)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={cn("text-5xl font-black", colorClass)}>
          {percentage.toFixed(1)}<span className="text-2xl">%</span>
        </span>
      </div>
    </div>
  );
}
