import React from "react";
import { motion } from "framer-motion";
import { Banknote, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, truncate } from "../../lib/utils";
import type { SalaryPayout } from "../../types";

interface SalaryCardProps {
  payout: SalaryPayout;
  onEdit: (payout: SalaryPayout) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export const SalaryCard: React.FC<SalaryCardProps> = ({
  payout,
  onEdit,
  onDelete,
  index = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
    className="flex items-center gap-3 p-3 rounded-2xl border border-accent-lime/15 bg-accent-lime/[0.025]"
  >
    <div className="w-9 h-9 rounded-xl bg-accent-lime/15 flex items-center justify-center flex-shrink-0">
      <Banknote size={16} className="text-accent-lime" />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-sm font-700 text-accent-lime">
          {formatCurrency(payout.amount)}
        </span>
        <span className="text-xs text-white/35">{formatDate(payout.date)}</span>
      </div>
      <p className="text-xs text-white/55 truncate">{payout.source}</p>
      {payout.comment && (
        <p className="text-xs text-white/30 truncate">
          {truncate(payout.comment, 50)}
        </p>
      )}
    </div>

    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => onEdit(payout)}
        className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={() => onDelete(payout.id)}
        className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </motion.div>
);
