import { Home, CalendarCheck2, Wallet, Package, ChartColumnBig } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const items = [
  { to: "/", icon: Home, label: "Головна" },
  { to: "/planner", icon: CalendarCheck2, label: "Планер" },
  { to: "/finance", icon: Wallet, label: "Фінанси" },
  { to: "/salary", icon: Package, label: "Склад/ЗП" },
  { to: "/stats", icon: ChartColumnBig, label: "Статистика" },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg border-t border-border/70 bg-[#0b0f16]/95 px-2 py-2 backdrop-blur-xl">
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center rounded-xl py-2 text-[10px] transition",
                  isActive ? "bg-accent/20 text-accentAlt" : "text-slate-400 hover:text-white",
                )
              }
            >
              <item.icon className="mb-1 h-4 w-4" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

