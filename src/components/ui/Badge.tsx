import { cn } from "../../lib/utils";

const variants = {
  planned: "bg-accent/20 text-accentAlt border-accent/40",
  done: "bg-accentAlt/20 text-accentAlt border-accentAlt/40",
  cancelled: "bg-rose-500/20 text-rose-300 border-rose-400/30",
  awaiting: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  partially_paid: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
  paid: "bg-lime/20 text-lime border-lime/40",
  high: "bg-rose-500/20 text-rose-300 border-rose-400/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
};

export function Badge({ label, variant }: { label: string; variant: keyof typeof variants }) {
  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", variants[variant])}>{label}</span>;
}

