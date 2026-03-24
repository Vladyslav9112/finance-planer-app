import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Clock,
  Banknote,
  CalendarCheck,
  CheckCircle2,
  Activity,
} from "lucide-react";
import dayjs from "dayjs";
import { useFinanceStore } from "../store/useFinanceStore";
import { usePlanStore } from "../store/usePlanStore";
import { useWarehouseStore } from "../store/useWarehouseStore";
import { SummaryCard } from "../components/ui/SummaryCard";
import { GlassCard } from "../components/ui/GlassCard";
import { PeriodFilter } from "../components/ui/PeriodFilter";
import { SectionHeader } from "../components/ui/SectionHeader";
import {
  IncomeExpenseChart,
  EarningsAreaChart,
  BalanceLineChart,
} from "../components/stats/StatsPanel";
import {
  cn,
  formatCurrency,
  dateFromDaysAgo,
  today,
  isInRange,
} from "../lib/utils";
import type { PeriodOption, DateRange } from "../types";

const StatsPage: React.FC = () => {
  const { incomes, expenses } = useFinanceStore();
  const { plans } = usePlanStore();
  const {
    earningsRecords,
    salaryPayouts,
    totalEarningsFromTara,
    totalPaidOut,
    totalAmountOwedToMe,
  } = useWarehouseStore();

  const [period, setPeriod] = useState<PeriodOption>("30");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: dateFromDaysAgo(30),
    to: today(),
  });

  const handlePeriodChange = (p: PeriodOption, range: DateRange) => {
    setPeriod(p);
    setDateRange(range);
  };

  // All-time totals
  const totalIncome = useMemo(
    () => incomes.reduce((s, i) => s + i.amount, 0),
    [incomes],
  );
  const totalExpenses = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses],
  );
  const balance = totalIncome - totalExpenses;
  const totalPlans = plans.length;
  const completedPlans = plans.filter((p) => p.status === "completed").length;
  const activePlans = plans.filter((p) => p.status === "scheduled").length;

  // Period filtered
  const periodIncomes = useMemo(
    () =>
      incomes.filter((i) => isInRange(i.date, dateRange.from, dateRange.to)),
    [incomes, dateRange],
  );
  const periodExpenses = useMemo(
    () =>
      expenses.filter((e) => isInRange(e.date, dateRange.from, dateRange.to)),
    [expenses, dateRange],
  );
  const periodIncome = periodIncomes.reduce((s, i) => s + i.amount, 0);
  const periodExpense = periodExpenses.reduce((s, e) => s + e.amount, 0);

  // Chart data - income/expense per day (last 7 days)
  const incomeExpenseData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = dayjs().subtract(6 - i, "day");
      const dateStr = d.format("YYYY-MM-DD");
      const inc = incomes
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.amount, 0);
      const exp = expenses
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.amount, 0);
      return { name: d.format("DD.MM"), income: inc, expense: exp };
    });
  }, [incomes, expenses]);

  // Earnings/paidOut timeline
  const earningsData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = dayjs().subtract(6 - i, "day");
      const dateStr = d.format("YYYY-MM-DD");
      const earned = earningsRecords
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.totalAmount, 0);
      const paid = salaryPayouts
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.amount, 0);
      return { name: d.format("DD.MM"), earnings: earned, paidOut: paid };
    });
  }, [earningsRecords, salaryPayouts]);

  // Balance timeline
  const balanceData = useMemo(() => {
    let running = 0;
    return Array.from({ length: 7 }, (_, i) => {
      const d = dayjs().subtract(6 - i, "day");
      const dateStr = d.format("YYYY-MM-DD");
      const inc = incomes
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.amount, 0);
      const exp = expenses
        .filter((x) => x.date === dateStr)
        .reduce((s, v) => s + v.amount, 0);
      running += inc - exp;
      return { name: d.format("DD.MM"), balance: running };
    });
  }, [incomes, expenses]);

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-lg font-700 text-white">Статистика</h1>
        <p className="text-xs text-white/35 mt-0.5">Загальна аналітика</p>
      </motion.div>

      {/* Finance summary */}
      <div>
        <SectionHeader title="Фінанси" subtitle="Загальні показники" />
        <div className="grid grid-cols-2 gap-2.5">
          <SummaryCard
            title="Загальний дохід"
            value={totalIncome}
            isCurrency
            icon={<TrendingUp size={16} />}
            accentColor="lime"
            delay={0}
          />
          <SummaryCard
            title="Загальні витрати"
            value={totalExpenses}
            isCurrency
            icon={<TrendingDown size={16} />}
            accentColor="rose"
            delay={0.05}
          />
          <SummaryCard
            title="Баланс"
            value={balance}
            isCurrency
            icon={<Wallet size={16} />}
            accentColor={balance >= 0 ? "teal" : "rose"}
            delay={0.1}
          />
          <SummaryCard
            title="По тарі зароблено"
            value={totalEarningsFromTara}
            isCurrency
            icon={<Package size={16} />}
            accentColor="violet"
            delay={0.15}
          />
        </div>
      </div>

      {/* Payouts summary */}
      <div>
        <SectionHeader title="Виплати ЗП" subtitle="Облік тари і зарплати" />
        <div className="grid grid-cols-2 gap-2.5">
          <SummaryCard
            title="Видано всього"
            value={totalPaidOut}
            isCurrency
            icon={<Banknote size={16} />}
            accentColor="lime"
            delay={0.2}
          />
          <SummaryCard
            title="Мають видати"
            value={totalAmountOwedToMe}
            isCurrency
            icon={<Clock size={16} />}
            accentColor="teal"
            delay={0.25}
          />
        </div>
      </div>

      {/* Plans summary */}
      <div>
        <SectionHeader title="Планер" subtitle="Статистика по задачах" />
        <div className="grid grid-cols-3 gap-2.5">
          <SummaryCard
            title="Всі плани"
            value={totalPlans}
            icon={<CalendarCheck size={16} />}
            accentColor="violet"
            delay={0.3}
          />
          <SummaryCard
            title="Виконано"
            value={completedPlans}
            icon={<CheckCircle2 size={16} />}
            accentColor="lime"
            delay={0.35}
          />
          <SummaryCard
            title="Активних"
            value={activePlans}
            icon={<Activity size={16} />}
            accentColor="teal"
            delay={0.4}
          />
        </div>
      </div>

      {/* Period filter */}
      <GlassCard className="p-4">
        <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-3">
          Фільтр за датою
        </p>
        <PeriodFilter
          value={period}
          customRange={dateRange}
          onChange={handlePeriodChange}
        />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <p className="text-[10px] text-white/35 mb-0.5">Доходи</p>
            <p className="text-sm font-800 text-accent-lime">
              {formatCurrency(periodIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/35 mb-0.5">Витрати</p>
            <p className="text-sm font-800 text-rose-400">
              {formatCurrency(periodExpense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/35 mb-0.5">Різниця</p>
            <p
              className={cn(
                "text-sm font-800",
                periodIncome - periodExpense >= 0
                  ? "text-accent-teal"
                  : "text-rose-400",
              )}
            >
              {formatCurrency(periodIncome - periodExpense)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Charts */}
      <GlassCard className="p-4">
        <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-4">
          Доходи vs Витрати (7 днів)
        </p>
        <IncomeExpenseChart data={incomeExpenseData} />
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-4">
          Заробіток по тарі та виплати (7 днів)
        </p>
        <EarningsAreaChart data={earningsData} />
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-4">
          Кумулятивний баланс (7 днів)
        </p>
        <BalanceLineChart data={balanceData} />
      </GlassCard>

      {/* Progress indicators */}
      <GlassCard className="p-4 space-y-4">
        <p className="text-xs font-700 text-white/40 uppercase tracking-wider">
          Ключові показники
        </p>

        {/* Plans completion */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-white/50">Плани виконано</span>
            <span className="text-xs font-700 text-white/70">
              {totalPlans > 0
                ? Math.round((completedPlans / totalPlans) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.07]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0}%`,
              }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-accent-lime"
            />
          </div>
        </div>

        {/* ЗП paid out */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-white/50">ЗП виплачено</span>
            <span className="text-xs font-700 text-white/70">
              {totalEarningsFromTara > 0
                ? Math.round((totalPaidOut / totalEarningsFromTara) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.07]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${totalEarningsFromTara > 0 ? Math.min((totalPaidOut / totalEarningsFromTara) * 100, 100) : 0}%`,
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-accent-teal to-accent-lime"
            />
          </div>
        </div>

        {/* Savings rate */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-white/50">Рівень заощадження</span>
            <span className="text-xs font-700 text-white/70">
              {totalIncome > 0
                ? Math.max(
                    0,
                    Math.round(
                      ((totalIncome - totalExpenses) / totalIncome) * 100,
                    ),
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.07]">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${totalIncome > 0 ? Math.max(0, Math.min(((totalIncome - totalExpenses) / totalIncome) * 100, 100)) : 0}%`,
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full rounded-full bg-accent-violet"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default StatsPage;
