import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";
import { cn, formatCurrency, today } from "../../lib/utils";
import { TARA_RATES } from "../../lib/constants";
import type { TaraRate, TaraEntry } from "../../types";

interface TaraCalculatorProps {
  onSave: (
    entries: TaraEntry[],
    totalAmount: number,
    date: string,
    comment: string,
  ) => void;
}

type QuantityMap = Record<TaraRate, string>;

const initialQty: QuantityMap = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
};

export const TaraCalculator: React.FC<TaraCalculatorProps> = ({ onSave }) => {
  const [quantities, setQuantities] = useState<QuantityMap>(initialQty);
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(today());

  const setQty = useCallback((rate: TaraRate, value: string) => {
    setQuantities((prev) => ({ ...prev, [rate]: value }));
  }, []);

  const rows = useMemo(
    () =>
      TARA_RATES.map((rate) => {
        const qty = parseFloat(quantities[rate]) || 0;
        return { rate, qty, amount: qty * rate };
      }),
    [quantities],
  );

  const totalAmount = useMemo(
    () => rows.reduce((s, r) => s + r.amount, 0),
    [rows],
  );

  const handleSave = () => {
    if (totalAmount === 0) return;
    const entries: TaraEntry[] = rows
      .filter((r) => r.qty > 0)
      .map((r) => ({ rate: r.rate, quantity: r.qty, amount: r.amount }));
    onSave(entries, totalAmount, date, comment);
    setQuantities(initialQty);
    setComment("");
  };

  const handleReset = () => {
    setQuantities(initialQty);
    setComment("");
  };

  return (
    <div className="space-y-4">
      {/* Date */}
      <div>
        <label className="text-xs font-600 text-white/45 mb-1.5 block">
          Дата
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors"
        />
      </div>

      {/* Rate table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 gap-0 bg-white/[0.04] border-b border-white/[0.06]">
          {["Тариф", "Кількість", "Сума"].map((h) => (
            <div
              key={h}
              className="px-3 py-2 text-[11px] font-700 text-white/40 uppercase tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map(({ rate, qty, amount }, i) => (
          <motion.div
            key={rate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "grid grid-cols-3 gap-0 items-center",
              i < rows.length - 1 && "border-b border-white/[0.05]",
              qty > 0 && "bg-accent-violet/[0.03]",
            )}
          >
            {/* Rate */}
            <div className="px-3 py-2.5">
              <span
                className={cn(
                  "text-sm font-800",
                  qty > 0 ? "text-accent-violet" : "text-white/60",
                )}
              >
                ×{rate}
              </span>
            </div>

            {/* Input */}
            <div className="px-2 py-1.5">
              <input
                type="number"
                min="0"
                value={quantities[rate]}
                onChange={(e) => setQty(rate, e.target.value)}
                placeholder="0"
                className={cn(
                  "w-full bg-white/[0.06] border rounded-lg px-2.5 py-1.5 text-sm text-white text-center",
                  "placeholder-white/20 focus:outline-none transition-colors",
                  qty > 0
                    ? "border-accent-violet/40 focus:border-accent-violet/60"
                    : "border-white/[0.08] focus:border-white/20",
                )}
              />
            </div>

            {/* Amount */}
            <div className="px-3 py-2.5 text-right">
              <span
                className={cn(
                  "text-sm font-700",
                  amount > 0 ? "text-accent-lime" : "text-white/25",
                )}
              >
                {amount > 0 ? formatCurrency(amount) : "—"}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Total */}
        <div className="grid grid-cols-3 bg-white/[0.05] border-t border-white/[0.08]">
          <div className="px-3 py-3 col-span-2">
            <span className="text-xs font-700 text-white/60 uppercase tracking-wider">
              Разом
            </span>
          </div>
          <div className="px-3 py-3 text-right">
            <span
              className={cn(
                "text-base font-800",
                totalAmount > 0 ? "text-accent-lime" : "text-white/25",
              )}
            >
              {totalAmount > 0 ? formatCurrency(totalAmount) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-600 text-white/45 mb-1.5 block">
          Коментар
        </label>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Наприклад: зміна 1, об'єкт X..."
          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-violet/50 transition-colors"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          className="p-3 rounded-xl border border-white/[0.08] text-white/40 hover:border-white/15 hover:text-white/60 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={handleSave}
          disabled={totalAmount === 0}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-700 flex items-center justify-center gap-2 transition-all",
            totalAmount > 0
              ? "bg-accent-violet/20 border border-accent-violet/40 text-accent-violet hover:bg-accent-violet/30"
              : "bg-white/[0.04] border border-white/[0.07] text-white/25 cursor-not-allowed",
          )}
        >
          <Save size={15} />
          Зберегти {totalAmount > 0 && `(${formatCurrency(totalAmount)})`}
        </button>
      </div>
    </div>
  );
};
