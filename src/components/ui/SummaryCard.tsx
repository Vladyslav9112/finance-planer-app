import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  hint?: string;
  accent?: "lime" | "teal" | "violet";
}

const accentStyles = {
  lime: "from-lime/20 to-transparent border-lime/30",
  teal: "from-accentAlt/20 to-transparent border-accentAlt/30",
  violet: "from-accent/20 to-transparent border-accent/30",
};

export function SummaryCard({ title, value, icon, hint, accent = "violet" }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-4 shadow-soft transition hover:-translate-y-0.5",
        accentStyles[accent],
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <span className="text-slate-300">{icon}</span>
      </div>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

