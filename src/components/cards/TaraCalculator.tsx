import { useMemo } from "react";
import { taraRates } from "../../data/mockData";
import type { TaraEntry } from "../../types/entities";

interface TaraCalculatorProps {
  quantities: Record<number, number>;
  onChange: (rate: number, quantity: number) => void;
}

export function TaraCalculator({ quantities, onChange }: TaraCalculatorProps) {
  const rows = useMemo(
    () =>
      taraRates.map((rate) => {
        const quantity = quantities[rate] || 0;
        return { rate, quantity, sum: rate * quantity };
      }),
    [quantities],
  );

  const total = rows.reduce((acc, row) => acc + row.sum, 0);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-panelAlt/50 p-3">
      <div className="grid grid-cols-3 text-xs text-slate-400">
        <p>Тариф</p>
        <p>Кількість</p>
        <p className="text-right">Сума</p>
      </div>
      {rows.map((row) => (
        <div key={row.rate} className="grid grid-cols-3 items-center gap-2">
          <p className="rounded-lg bg-white/5 px-2 py-2 text-sm text-white">{row.rate}</p>
          <input
            type="number"
            min={0}
            value={row.quantity}
            onChange={(event) => onChange(row.rate, Number(event.target.value) || 0)}
            className="w-full rounded-lg border border-border bg-[#090d14] px-2 py-2 text-sm text-white outline-none ring-accent focus:ring"
          />
          <p className="text-right text-sm font-medium text-accentAlt">{row.sum}</p>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-border pt-2">
        <p className="text-sm text-slate-300">Всього</p>
        <p className="text-lg font-semibold text-white">{total}</p>
      </div>
    </div>
  );
}

export const toTaraEntries = (quantities: Record<number, number>): TaraEntry[] =>
  taraRates.map((rate) => {
    const quantity = quantities[rate] || 0;
    return { rate, quantity, sum: rate * quantity };
  });

