import React from "react";
import { NavLink } from "react-router-dom";
import { Home, CalendarCheck, Wallet, Package, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/", label: "Головна", Icon: Home, exact: true },
  { path: "/planner", label: "Планер", Icon: CalendarCheck, exact: false },
  { path: "/finance", label: "Фінанси", Icon: Wallet, exact: false },
  { path: "/warehouse", label: "Склад", Icon: Package, exact: false },
  { path: "/stats", label: "Статистика", Icon: BarChart2, exact: false },
];

export const BottomNav: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-30">
    {/* Blur backdrop */}
    <div className="absolute inset-0 bg-surface-1/80 backdrop-blur-xl border-t border-white/[0.07]" />

    <div className="relative flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom)]">
      {navItems.map(({ path, label, Icon, exact }) => (
        <NavLink
          key={path}
          to={path}
          end={exact}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 py-3 px-2 flex-1 min-w-0",
              "transition-all duration-200",
              isActive ? "text-white" : "text-white/35 hover:text-white/60",
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 rounded-xl bg-accent-teal/15"
                    transition={{ type: "spring", damping: 26, stiffness: 280 }}
                  />
                )}
                <Icon
                  size={20}
                  className={cn(
                    "relative z-10 transition-colors duration-200",
                    isActive ? "text-accent-teal" : "",
                  )}
                />
              </div>
              <span className="text-[10px] font-600 truncate">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
