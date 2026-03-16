import { CalendarClock, CircleCheckBig, Send, Trash2 } from "lucide-react";
import type { Plan } from "../../types/entities";
import { format } from "date-fns";
import { Badge } from "../ui/Badge";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onDone: (id: string) => void;
  onSend: (id: string) => void;
}

export function PlanCard({ plan, onEdit, onDelete, onDone, onSend }: PlanCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-panel/70 p-4 shadow-soft animate-fade-in-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{plan.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
        </div>
        <div className="flex gap-1">
          <Badge label={plan.status} variant={plan.status} />
          <Badge label={plan.priority} variant={plan.priority} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <CalendarClock className="h-4 w-4" />
        {format(new Date(plan.date), "dd.MM.yyyy")} {plan.time}
        <span className="rounded-full bg-white/5 px-2 py-0.5">{plan.category}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onEdit(plan)} className="rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/20">
          Редагувати
        </button>
        <button onClick={() => onDone(plan.id)} className="rounded-xl bg-accentAlt/20 px-3 py-2 text-xs text-accentAlt hover:bg-accentAlt/30">
          <span className="inline-flex items-center gap-1"><CircleCheckBig className="h-3.5 w-3.5" />Виконано</span>
        </button>
        <button onClick={() => onSend(plan.id)} className="rounded-xl bg-accent/20 px-3 py-2 text-xs text-violet-200 hover:bg-accent/30">
          <span className="inline-flex items-center gap-1"><Send className="h-3.5 w-3.5" />В канал</span>
        </button>
        <button onClick={() => onDelete(plan.id)} className="rounded-xl bg-rose-500/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/30">
          <span className="inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" />Видалити</span>
        </button>
      </div>
    </article>
  );
}

