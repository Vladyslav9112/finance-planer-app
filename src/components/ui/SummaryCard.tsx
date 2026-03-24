import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { cn, formatCurrency } from "../../lib/utils";

type AccentColor = "lime" | "teal" | "violet" | "rose";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accentColor?: AccentColor;
  subtitle?: string;
  isCurrency?: boolean;
  trend?: { value: number; label?: string };
  className?: string;
  delay?: number;
}

const accentStyles: Record<
  AccentColor,
  { glow: string; iconBg: string; valueColor: string; border: string }
> = {
  lime: {
    glow: "shadow-glow-lime",
    iconBg: "bg-accent-lime/15 text-accent-lime",
    valueColor: "text-accent-lime",
    border: "border-accent-lime/15",
  },
  teal: {
    glow: "shadow-glow-teal",
    iconBg: "bg-accent-teal/15 text-accent-teal",
    valueColor: "text-accent-teal",
    border: "border-accent-teal/15",
  },
  violet: {
    glow: "shadow-glow-violet",
    iconBg: "bg-accent-violet/15 text-accent-violet",
    valueColor: "text-accent-violet",
    border: "border-accent-violet/15",
  },
  rose: {
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
    iconBg: "bg-rose-500/15 text-rose-400",
    valueColor: "text-rose-400",
    border: "border-rose-500/15",
  },
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  accentColor = "teal",
  subtitle,
  isCurrency = false,
  trend,
  className,
  delay = 0,
}) => {
  const styles = accentStyles[accentColor];
  const displayValue =
    isCurrency && typeof value === "number"
      ? formatCurrency(value)
      : String(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        glareEnable={false}
        transitionSpeed={1000}
        className="w-full"
      >
        <div
          className={cn(
            "relative rounded-2xl border bg-white/[0.04] backdrop-blur-sm p-4 overflow-hidden select-none",
            styles.border,
            styles.glow,
            className,
          )}
        >
          {/* Top gradient shimmer */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          {/* Corner glow accent */}
          <div
            className={cn(
              "absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30 animate-glow-pulse",
              accentColor === "lime" && "bg-accent-lime",
              accentColor === "teal" && "bg-accent-teal",
              accentColor === "violet" && "bg-accent-violet",
              accentColor === "rose" && "bg-rose-500",
            )}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/45 uppercase tracking-wider mb-2">
                {title}
              </p>
              <p
                className={cn(
                  "text-xl font-800 leading-tight truncate",
                  styles.valueColor,
                )}
              >
                {displayValue}
              </p>
              {subtitle && (
                <p className="text-xs text-white/35 mt-1 truncate">
                  {subtitle}
                </p>
              )}
              {trend && (
                <p
                  className={cn(
                    "text-xs font-600 mt-1",
                    trend.value >= 0 ? "text-accent-lime" : "text-rose-400",
                  )}
                >
                  {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
                  {trend.label || ""}
                </p>
              )}
            </div>
            <div
              className={cn("p-2.5 rounded-xl flex-shrink-0", styles.iconBg)}
            >
              {icon}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};
