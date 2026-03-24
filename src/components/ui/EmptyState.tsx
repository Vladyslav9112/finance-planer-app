import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className,
    )}
  >
    {icon && (
      <div className="mb-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-white/30">
        {icon}
      </div>
    )}
    <p className="text-sm font-600 text-white/50 mb-1">{title}</p>
    {description && (
      <p className="text-xs text-white/30 max-w-[220px] leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);
