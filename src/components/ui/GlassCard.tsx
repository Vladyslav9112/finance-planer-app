import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "lime" | "teal" | "violet" | "none";
  onClick?: () => void;
  animate?: boolean;
}

const glowMap = {
  lime: "shadow-glow-lime border-accent-lime/20 hover:border-accent-lime/35",
  teal: "shadow-glow-teal border-accent-teal/20 hover:border-accent-teal/35",
  violet:
    "shadow-glow-violet border-accent-violet/20 hover:border-accent-violet/35",
  none: "border-white/[0.07]",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = "none",
  onClick,
  animate = true,
}) => {
  const Comp = animate ? motion.div : "div";

  return (
    <Comp
      initial={animate ? { opacity: 0, y: 10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={animate ? { duration: 0.3 } : undefined}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border bg-white/[0.03] backdrop-blur-sm overflow-hidden",
        "transition-all duration-200",
        onClick && "cursor-pointer active:scale-[0.99]",
        glowMap[glowColor],
        className,
      )}
    >
      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
      <div className="relative">{children}</div>
    </Comp>
  );
};
