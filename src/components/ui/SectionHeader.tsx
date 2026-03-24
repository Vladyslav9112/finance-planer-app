import React from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => (
  <div
    className={cn("flex items-center justify-between gap-3 mb-4", className)}
  >
    <div>
      <h2 className="text-base font-700 text-white">{title}</h2>
      {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
