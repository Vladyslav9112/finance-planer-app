import React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "lime" | "teal" | "violet" | "rose" | "gray" | "amber";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, string> = {
  lime: "bg-accent-lime/12 border-accent-lime/25 text-accent-lime",
  teal: "bg-accent-teal/12 border-accent-teal/25 text-accent-teal",
  violet: "bg-accent-violet/12 border-accent-violet/25 text-accent-violet",
  rose: "bg-rose-500/12 border-rose-500/25 text-rose-400",
  gray: "bg-white/[0.06] border-white/10 text-white/50",
  amber: "bg-amber-500/12 border-amber-500/25 text-amber-400",
};

const dotMap: Record<BadgeVariant, string> = {
  lime: "bg-accent-lime",
  teal: "bg-accent-teal",
  violet: "bg-accent-violet",
  rose: "bg-rose-400",
  gray: "bg-white/40",
  amber: "bg-amber-400",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gray",
  className,
  dot = false,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-600 leading-none",
      variantMap[variant],
      className,
    )}
  >
    {dot && (
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full flex-shrink-0",
          dotMap[variant],
        )}
      />
    )}
    {children}
  </span>
);
