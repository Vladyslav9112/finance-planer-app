import React from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const AppLayout: React.FC = () => (
  <div className="relative flex flex-col h-svh overflow-hidden bg-transparent">
    {/* Page content */}
    <main className="flex-1 overflow-y-auto overscroll-y-contain pb-[72px]">
      <Outlet />
    </main>

    {/* Fixed bottom navigation */}
    <BottomNav />
  </div>
);

export default AppLayout;
