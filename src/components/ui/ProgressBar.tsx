"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { MAX_BASE_STAT } from "@/lib/constants";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  animated?: boolean;
  delay?: number;
}

function getStatColor(value: number, max: number): string {
  const pct = value / max;
  if (pct >= 0.7) return "bg-green-500";
  if (pct >= 0.4) return "bg-yellow-400";
  return "bg-red-400";
}

export function ProgressBar({
  value,
  max = MAX_BASE_STAT,
  label,
  className,
  animated = true,
  delay = 0,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = getStatColor(value, max);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span className="text-text-secondary w-20 shrink-0 text-right text-xs font-medium">
          {label}
        </span>
      )}
      <span className="text-text-primary w-8 shrink-0 text-xs font-semibold">{value}</span>
      <div className="bg-bg-muted h-2 flex-1 overflow-hidden rounded-full">
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", color)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
          />
        ) : (
          <div className={cn("h-full rounded-full", color)} style={{ width: `${percentage}%` }} />
        )}
      </div>
    </div>
  );
}
