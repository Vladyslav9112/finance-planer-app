import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "./components/ui/AnimatedBackground";
import { Toast } from "./components/ui/Toast";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PlannerPage from "./pages/PlannerPage";
import FinancePage from "./pages/FinancePage";
import WarehousePage from "./pages/WarehousePage";
import StatsPage from "./pages/StatsPage";
import { useFinanceStore } from "./store/useFinanceStore";
import { usePlanStore } from "./store/usePlanStore";
import { useWarehouseStore } from "./store/useWarehouseStore";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      useFinanceStore.getState().init(),
      usePlanStore.getState().init(),
      useWarehouseStore.getState().init(),
    ]).finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.7)",
          fontSize: 18,
        }}
      >
        <span>Завантаження...</span>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
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
          <AppInitializer>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="planner" element={<PlannerPage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="warehouse" element={<WarehousePage />} />
                <Route path="stats" element={<StatsPage />} />
              </Route>
            </Routes>
          </AppInitializer>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
