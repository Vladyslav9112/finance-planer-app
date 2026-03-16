import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-panelAlt/30 p-6 text-center animate-fade-in-up">
      <div className="mx-auto mb-3 w-fit rounded-xl bg-white/5 p-3 text-slate-300">{icon}</div>
      <h3 className="text-base font-medium text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

