import React, { useState } from "react";
import { cn } from "../../lib/utils";
import type { PeriodOption, DateRange } from "../../types";
import { PERIOD_OPTIONS } from "../../lib/constants";
import { dateFromDaysAgo, today } from "../../lib/utils";

interface PeriodFilterProps {
  value: PeriodOption;
  customRange?: DateRange;
  onChange: (period: PeriodOption, range: DateRange) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value,
  customRange,
  onChange,
}) => {
  const [fromDate, setFromDate] = useState(
    customRange?.from || dateFromDaysAgo(7),
  );
  const [toDate, setToDate] = useState(customRange?.to || today());

  const handlePeriod = (period: PeriodOption) => {
    if (period === "custom") {
      onChange("custom", { from: fromDate, to: toDate });
      return;
    }
    const days = parseInt(period, 10);
    onChange(period, { from: dateFromDaysAgo(days), to: today() });
  };

  const handleCustomApply = () => {
    onChange("custom", { from: fromDate, to: toDate });
  };

  return (
    <div className="space-y-3">
      {/* Period buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {PERIOD_OPTIONS.map(({ value: v, label }) => (
          <button
            key={v}
            onClick={() => handlePeriod(v)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-600 transition-all duration-150 border",
              value === v
                ? "bg-accent-teal/15 border-accent-teal/40 text-accent-teal"
                : "bg-white/[0.04] border-white/[0.07] text-white/50 hover:text-white/80 hover:border-white/15",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom range */}
      {value === "custom" && (
        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-white/40 mb-1.5 block">Від</label>
            <input
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-teal/50"
            />
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="text-xs text-white/40 mb-1.5 block">До</label>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              max={today()}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-teal/50"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className="px-4 py-2 rounded-xl bg-accent-teal/20 border border-accent-teal/40 text-accent-teal text-xs font-700 hover:bg-accent-teal/30 transition-colors"
          >
            Застосувати
          </button>
        </div>
      )}
    </div>
  );
};
