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
      <div
        style={{
          position: "relative",
          zIndex: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Layered background (fixed, z-0) */}
        <AnimatedBackground />

        {/* Toast notifications */}
        <Toast />

        {/* App routes */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="warehouse" element={<WarehousePage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
