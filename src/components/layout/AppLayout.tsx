import React from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const AppLayout: React.FC = () => (
  <div
    className="relative flex flex-col flex-1 overflow-hidden bg-transparent"
    style={{ minHeight: 0 }}
  >
    {/* Page content */}
    <main className="flex-1 overflow-y-auto overscroll-y-contain pb-[72px]">
      <Outlet />
    </main>

    {/* Fixed bottom navigation */}
    <BottomNav />
  </div>
);

export default AppLayout;
