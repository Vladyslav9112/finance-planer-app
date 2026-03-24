import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
  Trash2,
  Send,
  CheckCheck,
} from "lucide-react";
import { cn, formatDateTime, truncate } from "../../lib/utils";
import {
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "../../lib/constants";
import { Badge } from "../ui/Badge";
import type { Plan } from "../../types";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onMarkComplete: (id: string) => void;
  onSendToChannel: (plan: Plan) => void;
  index?: number;
}

const StatusIcon: Record<string, React.ReactNode> = {
  scheduled: <Clock size={13} />,
  completed: <CheckCircle2 size={13} />,
  cancelled: <XCircle size={13} />,
};

const priorityVariantMap: Record<string, "rose" | "lime" | "teal"> = {
  high: "rose",
  medium: "lime",
  low: "teal",
};
const statusVariantMap: Record<string, "teal" | "lime" | "gray"> = {
  scheduled: "teal",
  completed: "lime",
  cancelled: "gray",
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onMarkComplete,
  onSendToChannel,
  index = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, delay: index * 0.04 }}
    className={cn(
      "relative rounded-2xl border bg-white/[0.03] backdrop-blur-sm overflow-hidden",
      "transition-all duration-200",
      plan.status === "completed"
        ? "border-accent-lime/15 opacity-75"
        : plan.status === "cancelled"
          ? "border-white/[0.05] opacity-55"
          : "border-white/[0.08] hover:border-white/15",
    )}
  >
    {/* Priority top strip */}
    <div
      className={cn(
        "absolute top-0 left-0 right-0 h-0.5",
        plan.priority === "high"
          ? "bg-gradient-to-r from-rose-500/80 via-rose-400/60 to-transparent"
          : plan.priority === "medium"
            ? "bg-gradient-to-r from-accent-lime/60 via-accent-lime/40 to-transparent"
            : "bg-gradient-to-r from-accent-teal/50 via-accent-teal/30 to-transparent",
      )}
    />

    <div className="p-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className={cn(
            "text-sm font-700 text-white leading-snug flex-1",
            plan.status === "completed" && "line-through text-white/50",
            plan.status === "cancelled" && "text-white/35",
          )}
        >
          {plan.title}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          <Badge variant={statusVariantMap[plan.status]} dot>
            <span className="mr-0.5">{StatusIcon[plan.status]}</span>
            {STATUS_LABELS[plan.status]}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {plan.description && (
        <p className="text-xs text-white/40 mb-3 leading-relaxed">
          {truncate(plan.description, 100)}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-xs text-white/40 font-500">
          {formatDateTime(plan.date, plan.time)}
        </span>
        <Badge variant={priorityVariantMap[plan.priority]}>
          {PRIORITY_LABELS[plan.priority]}
        </Badge>
        {plan.category && <Badge variant="gray">{plan.category}</Badge>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
        {plan.status === "scheduled" && (
          <button
            onClick={() => onMarkComplete(plan.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-lime/15 border border-accent-lime/25 text-accent-lime text-xs font-600 hover:bg-accent-lime/25 transition-colors"
          >
            <CheckCheck size={13} />
            Виконано
          </button>
        )}
        <button
          onClick={() => onSendToChannel(plan)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-teal/10 border border-accent-teal/20 text-accent-teal text-xs font-600 hover:bg-accent-teal/20 transition-colors"
        >
          <Send size={12} />
          Канал
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onEdit(plan)}
          className="p-1.5 rounded-xl text-white/35 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(plan.id)}
          className="p-1.5 rounded-xl text-white/35 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);
