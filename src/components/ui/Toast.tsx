import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";
import type { ToastType } from "../../types";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <Check size={15} />,
  error: <AlertCircle size={15} />,
  info: <Info size={15} />,
  warning: <AlertTriangle size={15} />,
};

const colorMap: Record<ToastType, string> = {
  success: "bg-accent-lime/15 border-accent-lime/30 text-accent-lime",
  error: "bg-rose-500/15 border-rose-500/30 text-rose-400",
  info: "bg-accent-teal/15 border-accent-teal/30 text-accent-teal",
  warning: "bg-amber-500/15 border-amber-500/30 text-amber-400",
};

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed top-3 inset-x-3 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-2xl border backdrop-blur-lg",
              "shadow-card pointer-events-auto",
              colorMap[t.type],
            )}
          >
            <span className="flex-shrink-0">{iconMap[t.type]}</span>
            <span className="flex-1 text-sm font-500 text-white">
              {t.message}
            </span>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
