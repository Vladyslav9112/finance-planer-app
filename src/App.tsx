import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "./components/ui/AnimatedBackground";
import { Toast } from "./components/ui/Toast";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PlannerPage from "./pages/PlannerPage";
import FinancePage from "./pages/FinancePage";
import WarehousePage from "./pages/WarehousePage";
import StatsPage from "./pages/StatsPage";

const App: React.FC = () => {
  return (
    <HashRouter>
      {/* Layered background (fixed, z-0) */}
      <AnimatedBackground />

      {/* Toast notifications */}
      <Toast />

      {/* App routes */}
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
