import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import type { Expense, Income } from "../../types/entities";
import { formatMoney } from "../../lib/utils";

interface FinanceCardProps {
  entry: Income | Expense;
  type: "income" | "expense";
  onDelete: (id: string) => Promise<void>;
}

export function FinanceCard({ entry, type, onDelete }: FinanceCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-panel/70 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{type === "income" ? (entry as Income).source : (entry as Expense).category}</p>
          <p className="text-lg font-semibold text-white">{formatMoney(entry.amount)}</p>
          <p className="text-xs text-slate-500">{entry.date}</p>
          {entry.comment ? <p className="mt-1 text-sm text-slate-400">{entry.comment}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {type === "income" ? (
            <ArrowUpCircle className="h-5 w-5 text-emerald-300" />
          ) : (
            <ArrowDownCircle className="h-5 w-5 text-rose-300" />
          )}
          <button onClick={() => onDelete(entry.id)} className="rounded-lg bg-white/5 p-2 hover:bg-white/10">
            <Trash2 className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>
    </article>
  );
}

