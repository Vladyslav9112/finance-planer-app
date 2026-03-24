import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Pencil, Trash2 } from "lucide-react";
import { cn, formatCurrency, formatDate, truncate } from "../../lib/utils";
import { INCOME_TYPE_LABELS } from "../../lib/constants";
import { Badge } from "../ui/Badge";
import type { Income, Expense } from "../../types";

// ─── Income Card ──────────────────────────────────────────────────────────────

interface IncomeCardProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({
  income,
  onEdit,
  onDelete,
  index = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
    className="flex items-center gap-3 p-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/12 transition-colors"
  >
    <div className="w-9 h-9 rounded-xl bg-accent-lime/15 flex items-center justify-center flex-shrink-0">
      <TrendingUp size={16} className="text-accent-lime" />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-sm font-700 text-accent-lime">
          +{formatCurrency(income.amount)}
        </span>
        <Badge variant={income.type === "salary_payout" ? "violet" : "gray"}>
          {INCOME_TYPE_LABELS[income.type]}
        </Badge>
      </div>
      <p className="text-xs text-white/55 truncate">{income.source}</p>
      {income.comment && (
        <p className="text-xs text-white/30 truncate">
          {truncate(income.comment, 60)}
        </p>
      )}
      <p className="text-[11px] text-white/30 mt-0.5">
        {formatDate(income.date)}
      </p>
    </div>

    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => onEdit(income)}
        className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={() => onDelete(income.id)}
        className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        disabled={!!income.relatedSalaryPayoutId}
        title={
          income.relatedSalaryPayoutId ? "Авто-дохід від виплати ЗП" : undefined
        }
      >
        <Trash2 size={13} />
      </button>
    </div>
  </motion.div>
);

// ─── Expense Card ─────────────────────────────────────────────────────────────

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
  index = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
    className="flex items-center gap-3 p-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-white/12 transition-colors"
  >
    <div className="w-9 h-9 rounded-xl bg-rose-500/12 flex items-center justify-center flex-shrink-0">
      <TrendingDown size={16} className="text-rose-400" />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-sm font-700 text-rose-400">
          -{formatCurrency(expense.amount)}
        </span>
        <Badge variant="rose">{expense.category}</Badge>
      </div>
      {expense.comment && (
        <p className="text-xs text-white/40 truncate">
          {truncate(expense.comment, 60)}
        </p>
      )}
      <p className="text-[11px] text-white/30 mt-0.5">
        {formatDate(expense.date)}
      </p>
    </div>

    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => onEdit(expense)}
        className="p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={() => onDelete(expense.id)}
        className="p-1.5 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </motion.div>
);
