import { ChartLine } from "lucide-react";
import { StatsPanel } from "../../components/cards/StatsPanel";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { formatMoney } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";

export function StatsPage() {
  const getStatsSummary = useAppStore((s) => s.getStatsSummary);
  const stats = getStatsSummary();

  return (
    <div className="space-y-4">
      <SectionHeader title="Статистика" subtitle="Аналітика фінансів, зарплати та планера" />

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard title="totalIncome" value={formatMoney(stats.totalIncome)} accent="teal" />
        <SummaryCard title="totalExpenses" value={formatMoney(stats.totalExpenses)} accent="violet" />
        <SummaryCard title="balance" value={formatMoney(stats.balance)} accent="lime" />
        <SummaryCard title="totalSalaryOwed" value={formatMoney(stats.totalSalaryOwed)} accent="teal" />
        <SummaryCard title="totalSalaryPaid" value={formatMoney(stats.totalSalaryPaid)} accent="violet" />
        <SummaryCard title="totalEarnings" value={formatMoney(stats.totalEarnings)} accent="lime" />
        <SummaryCard title="completedPlans" value={String(stats.completedPlans)} accent="teal" />
        <SummaryCard title="activePlans" value={String(stats.activePlans)} accent="violet" />
      </section>

      {stats.totalPlans === 0 && stats.totalIncome === 0 && stats.totalExpenses === 0 ? (
        <EmptyState title="Недостатньо даних" description="Додайте записи у модулі, щоб побачити графіки" icon={<ChartLine className="h-5 w-5" />} />
      ) : (
        <StatsPanel stats={stats} />
      )}
    </div>
  );
}

