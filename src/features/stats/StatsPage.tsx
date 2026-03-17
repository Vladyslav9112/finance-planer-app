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
        <SummaryCard title="Загальні доходи" value={formatMoney(stats.totalIncome)} accent="teal" />
        <SummaryCard title="Загальні витрати" value={formatMoney(stats.totalExpenses)} accent="violet" />
        <SummaryCard title="Баланс" value={formatMoney(stats.balance)} accent="lime" />
        <SummaryCard title="Ще повинні видати" value={formatMoney(stats.totalSalaryOwed)} accent="teal" />
        <SummaryCard title="Вже видано" value={formatMoney(stats.totalSalaryPaid)} accent="violet" />
        <SummaryCard title="Заробіток складу" value={formatMoney(stats.totalEarnings)} accent="lime" />
        <SummaryCard title="Виконані плани" value={String(stats.completedPlans)} accent="teal" />
        <SummaryCard title="Активні плани" value={String(stats.activePlans)} accent="violet" />
      </section>

      {stats.totalPlans === 0 && stats.totalIncome === 0 && stats.totalExpenses === 0 ? (
        <EmptyState title="Недостатньо даних" description="Додайте записи, щоб побачити графіки та підсумки" icon={<ChartLine className="h-5 w-5" />} />
      ) : (
        <StatsPanel stats={stats} />
      )}
    </div>
  );
}
