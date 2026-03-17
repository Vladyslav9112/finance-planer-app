import { Link, useLocation } from "react-router-dom";
import { CalendarClock, HandCoins, Plus, Wallet } from "lucide-react";
import { useAppStore, useTodayPlans } from "../../store/useAppStore";
import { formatMoney } from "../../lib/utils";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { PlanCard } from "../../components/cards/PlanCard";
import { EmptyState } from "../../components/ui/EmptyState";

export function HomePage() {
  const location = useLocation();
  const getStatsSummary = useAppStore((s) => s.getStatsSummary);
  const stats = getStatsSummary();
  const todayPlans = useTodayPlans();
  const markPlanDone = useAppStore((s) => s.markPlanDone);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const sendPlan = useAppStore((s) => s.sendPlan);

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard title="Баланс" value={formatMoney(stats.balance)} accent="teal" />
        <SummaryCard title="Ще повинні видати" value={formatMoney(stats.totalSalaryOwed)} accent="lime" />
        <SummaryCard title="Витрати" value={formatMoney(stats.totalExpenses)} accent="violet" />
        <SummaryCard title="Доходи" value={formatMoney(stats.totalIncome)} accent="teal" />
      </section>

      <section className="rounded-2xl border border-border bg-panel/70 p-4">
        <h2 className="mb-3 text-base font-semibold text-white">Швидкі дії</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Link
            to="/planner?action=add-plan"
            state={{ from: location.pathname }}
            className="rounded-xl bg-accent/25 px-3 py-2 text-center text-violet-200 hover:bg-accent/35"
          >
            <span className="inline-flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Додати план
            </span>
          </Link>
          <Link
            to="/finance?action=add-expense"
            state={{ from: location.pathname }}
            className="rounded-xl bg-rose-500/25 px-3 py-2 text-center text-rose-200 hover:bg-rose-500/35"
          >
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" />
              Додати витрату
            </span>
          </Link>
          <Link
            to="/finance?action=add-income"
            state={{ from: location.pathname }}
            className="rounded-xl bg-emerald-500/25 px-3 py-2 text-center text-emerald-200 hover:bg-emerald-500/35"
          >
            <span className="inline-flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Додати дохід
            </span>
          </Link>
          <Link
            to="/salary?action=payout"
            state={{ from: location.pathname }}
            className="rounded-xl bg-lime/25 px-3 py-2 text-center text-lime hover:bg-lime/35"
          >
            <span className="inline-flex items-center gap-1">
              <HandCoins className="h-3.5 w-3.5" />
              Видати ЗП
            </span>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-white">Сьогоднішні плани</h2>
        {todayPlans.length === 0 ? (
          <EmptyState
            title="На сьогодні порожньо"
            description="Додайте план і тримайте день під контролем"
            icon={<CalendarClock className="h-5 w-5" />}
          />
        ) : (
          todayPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => {}}
              onDelete={deletePlan}
              onDone={markPlanDone}
              onSend={async (id) => {
                try {
                  await sendPlan(id);
                } catch {
                  // noop for dashboard
                }
              }}
            />
          ))
        )}
      </section>
    </div>
  );
}
