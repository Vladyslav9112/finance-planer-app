import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { appEnv } from "../../lib/env";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#141b28_0,#090b10_48%,#07080c_100%)] text-slate-100">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-5">
        <header className="mb-5 rounded-2xl border border-border bg-panel/70 p-4 shadow-soft backdrop-blur animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Telegram Mini App</p>
          <h1 className="mt-1 text-xl font-semibold">{appEnv.appName}</h1>
        </header>
        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

