import React from "react";
import { motion } from "framer-motion";
import { Package, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatCurrency, formatDate } from "../../lib/utils";
import type { EarningsRecord } from "../../types";
import { useState } from "react";

interface EarningsCardProps {
  record: EarningsRecord;
  onEdit: (record: EarningsRecord) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
  record,
  onEdit,
  onDelete,
  index = 0,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-9 h-9 rounded-xl bg-accent-violet/15 flex items-center justify-center flex-shrink-0">
          <Package size={16} className="text-accent-violet" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-700 text-accent-violet">
              {formatCurrency(record.totalAmount)}
            </span>
            <span className="text-xs text-white/35">
              {formatDate(record.date)}
            </span>
          </div>
          {record.comment && (
            <p className="text-xs text-white/40 truncate">{record.comment}</p>
          )}
          <p className="text-[11px] text-white/25 mt-0.5">
            {record.entries.length} тип{record.entries.length !== 1 ? "и" : ""}{" "}
            тари
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => onEdit(record)}
            className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded entries */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-white/[0.05] px-3 pb-3 pt-2"
        >
          <div className="space-y-1">
            {record.entries.map((entry) => (
              <div
                key={entry.rate}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/[0.02]"
              >
                <span className="text-white/50">Тариф ×{entry.rate}</span>
                <span className="text-white/60">{entry.quantity} шт</span>
                <span className="text-accent-lime font-600">
                  {formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
