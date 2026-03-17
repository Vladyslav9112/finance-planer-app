import { HandCoins } from "lucide-react";
import type { SalaryRecord } from "../../types/entities";
import { formatMoney } from "../../lib/utils";
import { stripEarningsMarker } from "../../store/useAppStore";
import { Badge } from "../ui/Badge";

interface SalaryCardProps {
  record: SalaryRecord;
  owed: number;
  onPayout: (id: string) => void;
}

export function SalaryCard({ record, owed, onPayout }: SalaryCardProps) {
  const comment = stripEarningsMarker(record.comment);

  return (
    <article className="rounded-2xl border border-border bg-panel/70 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{record.source}</h3>
          <p className="text-xs text-slate-500">{record.date}</p>
        </div>
        <Badge label={record.status} variant={record.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-white/5 p-2">
          <p className="text-slate-400">Всього</p>
          <p className="font-medium text-white">{formatMoney(record.totalAmount)}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2">
          <p className="text-slate-400">Видано</p>
          <p className="font-medium text-emerald-300">{formatMoney(record.alreadyPaid)}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2">
          <p className="text-slate-400">Ще повинні видати</p>
          <p className="font-medium text-amber-300">{formatMoney(owed)}</p>
        </div>
      </div>
      {comment ? <p className="mt-2 text-sm text-slate-400">{comment}</p> : null}
      <button
        onClick={() => onPayout(record.id)}
        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accentAlt/20 px-3 py-2 text-xs text-accentAlt hover:bg-accentAlt/30"
      >
        <HandCoins className="h-4 w-4" /> Видати зарплату
      </button>
    </article>
  );
}
