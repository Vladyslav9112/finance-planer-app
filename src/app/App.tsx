import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../features/home/HomePage";
import { PlannerPage } from "../features/planner/PlannerPage";
import { FinancePage } from "../features/finance/FinancePage";
import { SalaryPage } from "../features/salary/SalaryPage";
import { StatsPage } from "../features/stats/StatsPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/salary" element={<SalaryPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Route>
    </Routes>
  );
}

