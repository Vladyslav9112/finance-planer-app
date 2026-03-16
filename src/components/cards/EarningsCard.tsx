import { formatMoney } from "../../lib/utils";
import type { EarningsRecord } from "../../types/entities";

export function EarningsCard({ record }: { record: EarningsRecord }) {
  return (
    <article className="rounded-2xl border border-border bg-panel/70 p-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-white">Заробіток за {record.date}</h3>
        <p className="text-sm font-semibold text-accentAlt">{formatMoney(record.totalAmount)}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {record.entries.map((entry) => (
          <div key={`${record.id}-${entry.rate}`} className="rounded-lg bg-white/5 p-2">
            <p className="text-slate-400">Тара {entry.rate}</p>
            <p className="text-white">{entry.quantity} шт</p>
            <p className="text-accentAlt">{formatMoney(entry.sum)}</p>
          </div>
        ))}
      </div>
      {record.comment ? <p className="mt-2 text-sm text-slate-400">{record.comment}</p> : null}
    </article>
  );
}

