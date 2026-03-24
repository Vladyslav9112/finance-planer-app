import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart2,
  Search,
  X,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useFinanceStore,
  selectTotalIncome,
  selectTotalExpenses,
} from "../store/useFinanceStore";
import { useAppStore } from "../store/useAppStore";
import { SummaryCard } from "../components/ui/SummaryCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ModalForm } from "../components/ui/ModalForm";
import { PeriodFilter } from "../components/ui/PeriodFilter";
import { IncomeForm } from "../components/finance/IncomeForm";
import { ExpenseForm } from "../components/finance/ExpenseForm";
import { IncomeCard, ExpenseCard } from "../components/finance/FinanceCard";
import { GlassCard } from "../components/ui/GlassCard";
import {
  IncomeExpenseChart,
  BalanceLineChart,
} from "../components/stats/StatsPanel";
import {
  cn,
  formatCurrency,
  dateFromDaysAgo,
  today,
  isInRange,
} from "../lib/utils";
import type { Income, Expense, PeriodOption, DateRange } from "../types";

type ActiveTab = "incomes" | "expenses" | "analytics";

const FinancePage: React.FC = () => {
  const {
    incomes,
    expenses,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useFinanceStore();
  const { addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>("incomes");
  const [isAddIncomeOpen, setAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchText, setSearchText] = useState("");

  // Period filter
  const [period, setPeriod] = useState<PeriodOption>("30");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: dateFromDaysAgo(30),
    to: today(),
  });

  const handlePeriodChange = (p: PeriodOption, range: DateRange) => {
    setPeriod(p);
    setDateRange(range);
  };

  // Totals (all time)
  const totalIncome = useMemo(() => selectTotalIncome(incomes), [incomes]);
  const totalExpenses = useMemo(
    () => selectTotalExpenses(expenses),
    [expenses],
  );
  const balance = totalIncome - totalExpenses;

  // Filtered by period
  const filteredIncomes = useMemo(
    () =>
      incomes.filter((i) => isInRange(i.date, dateRange.from, dateRange.to)),
    [incomes, dateRange],
  );
  const filteredExpenses = useMemo(
    () =>
      expenses.filter((e) => isInRange(e.date, dateRange.from, dateRange.to)),
    [expenses, dateRange],
  );

  const periodIncome = useMemo(
    () => filteredIncomes.reduce((s, i) => s + i.amount, 0),
    [filteredIncomes],
  );
  const periodExpense = useMemo(
    () => filteredExpenses.reduce((s, e) => s + e.amount, 0),
    [filteredExpenses],
  );
  const periodBalance = periodIncome - periodExpense;

  // Search filter
  const searchedIncomes = useMemo(
    () =>
      incomes.filter(
        (i) =>
          !searchText ||
          i.source.toLowerCase().includes(searchText.toLowerCase()) ||
          i.comment?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [incomes, searchText],
  );
  const searchedExpenses = useMemo(
    () =>
      expenses.filter(
        (e) =>
          !searchText ||
          e.category.toLowerCase().includes(searchText.toLowerCase()) ||
          e.comment?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [expenses, searchText],
  );

  // Chart data for analytics
  const chartData = useMemo(() => {
    const days = 7;
    return Array.from({ length: days }, (_, i) => {
      const d = dayjs().subtract(days - 1 - i, "day");
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

  const balanceChartData = useMemo(() => {
    let running = 0;
    const days = 7;
    return Array.from({ length: days }, (_, i) => {
      const d = dayjs().subtract(days - 1 - i, "day");
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

  const tabs: { key: ActiveTab; label: string; Icon: typeof TrendingUp }[] = [
    { key: "incomes", label: "Доходи", Icon: TrendingUp },
    { key: "expenses", label: "Витрати", Icon: TrendingDown },
    { key: "analytics", label: "Аналітика", Icon: BarChart2 },
  ];

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-700 text-white mb-3">Фінанси</h1>
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <SummaryCard
            title="Доходи"
            value={totalIncome}
            icon={<TrendingUp size={16} />}
            isCurrency
            accentColor="lime"
            delay={0}
          />
          <SummaryCard
            title="Витрати"
            value={totalExpenses}
            icon={<TrendingDown size={16} />}
            isCurrency
            accentColor="rose"
            delay={0.05}
          />
          <SummaryCard
            title="Баланс"
            value={balance}
            icon={<Wallet size={16} />}
            isCurrency
            accentColor={balance >= 0 ? "teal" : "rose"}
            delay={0.1}
          />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-700 transition-all duration-200",
              activeTab === key
                ? "bg-accent-teal/20 border border-accent-teal/35 text-accent-teal"
                : "text-white/40 hover:text-white/60",
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "incomes" && (
          <motion.div
            key="incomes"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <SectionHeader
              title="Доходи"
              subtitle={`${incomes.length} записів`}
              action={
                <button
                  onClick={() => setAddIncomeOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-lime/15 border border-accent-lime/30 text-accent-lime text-xs font-700 hover:bg-accent-lime/25 transition-all active:scale-95"
                >
                  <Plus size={13} />
                  Додати
                </button>
              }
            />
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Пошук за джерелом..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-accent-lime/40 transition-colors"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {searchedIncomes.length === 0 ? (
              <EmptyState
                icon={<TrendingUp size={24} />}
                title="Доходів немає"
                description="Додайте перший запис доходу"
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {searchedIncomes.map((inc, i) => (
                    <IncomeCard
                      key={inc.id}
                      income={inc}
                      index={i}
                      onEdit={setEditingIncome}
                      onDelete={(id) => {
                        deleteIncome(id);
                        addToast("Дохід видалено", "info");
                      }}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {activeTab === "expenses" && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <SectionHeader
              title="Витрати"
              subtitle={`${expenses.length} записів`}
              action={
                <button
                  onClick={() => setAddExpenseOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-700 hover:bg-rose-500/25 transition-all active:scale-95"
                >
                  <Plus size={13} />
                  Додати
                </button>
              }
            />
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Пошук за категорією..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-rose-500/40 transition-colors"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            {searchedExpenses.length === 0 ? (
              <EmptyState
                icon={<TrendingDown size={24} />}
                title="Витрат немає"
                description="Додайте перший запис витрати"
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {searchedExpenses.map((exp, i) => (
                    <ExpenseCard
                      key={exp.id}
                      expense={exp}
                      index={i}
                      onEdit={setEditingExpense}
                      onDelete={(id) => {
                        deleteExpense(id);
                        addToast("Витрату видалено", "info");
                      }}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
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
            </GlassCard>

            {/* Period summary */}
            <div className="grid grid-cols-3 gap-2.5">
              <SummaryCard
                title="Дохід"
                value={periodIncome}
                isCurrency
                icon={<TrendingUp size={14} />}
                accentColor="lime"
              />
              <SummaryCard
                title="Витрати"
                value={periodExpense}
                isCurrency
                icon={<TrendingDown size={14} />}
                accentColor="rose"
              />
              <SummaryCard
                title="Баланс"
                value={periodBalance}
                isCurrency
                icon={<Wallet size={14} />}
                accentColor={periodBalance >= 0 ? "teal" : "rose"}
              />
            </div>

            {/* Operations in period */}
            <GlassCard className="p-4">
              <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-3">
                Записи за вибраний період (
                {filteredIncomes.length + filteredExpenses.length})
              </p>
              {filteredIncomes.length + filteredExpenses.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-4">
                  Немає операцій за цей період
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {[
                    ...filteredIncomes.map((i) => ({ ...i, isIncome: true })),
                    ...filteredExpenses.map((e) => ({ ...e, isIncome: false })),
                  ]
                    .sort((a, b) => (b.date > a.date ? 1 : -1))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-white/[0.03]"
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-white/70 truncate">
                            {"source" in item
                              ? item.source
                              : (item as Expense).category}
                          </p>
                          <p className="text-[11px] text-white/30">
                            {item.date}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "text-sm font-700 ml-3 flex-shrink-0",
                            "isIncome" in item && item.isIncome
                              ? "text-accent-lime"
                              : "text-rose-400",
                          )}
                        >
                          {"isIncome" in item && item.isIncome ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </GlassCard>

            {/* Charts */}
            <GlassCard className="p-4">
              <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-4">
                Доходи vs Витрати (7 днів)
              </p>
              <IncomeExpenseChart data={chartData} />
            </GlassCard>

            <GlassCard className="p-4">
              <p className="text-xs font-700 text-white/40 uppercase tracking-wider mb-4">
                Динаміка балансу (7 днів)
              </p>
              <BalanceLineChart data={balanceChartData} />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ModalForm
        isOpen={isAddIncomeOpen}
        onClose={() => setAddIncomeOpen(false)}
        title="Новий дохід"
      >
        <IncomeForm
          onSubmit={(data) => {
            addIncome({ ...data, comment: data.comment ?? "" });
            addToast("Дохід додано ✅", "success");
            setAddIncomeOpen(false);
          }}
          onCancel={() => setAddIncomeOpen(false)}
        />
      </ModalForm>

      <ModalForm
        isOpen={isAddExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        title="Нова витрата"
      >
        <ExpenseForm
          onSubmit={(data) => {
            addExpense({ ...data, comment: data.comment ?? "" });
            addToast("Витрату додано", "success");
            setAddExpenseOpen(false);
          }}
          onCancel={() => setAddExpenseOpen(false)}
        />
      </ModalForm>

      <ModalForm
        isOpen={!!editingIncome}
        onClose={() => setEditingIncome(null)}
        title="Редагувати дохід"
      >
        <IncomeForm
          initial={editingIncome ?? undefined}
          onSubmit={(data) => {
            if (!editingIncome) return;
            updateIncome(editingIncome.id, {
              ...data,
              comment: data.comment ?? "",
            });
            addToast("Дохід оновлено", "success");
            setEditingIncome(null);
          }}
          onCancel={() => setEditingIncome(null)}
        />
      </ModalForm>

      <ModalForm
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Редагувати витрату"
      >
        <ExpenseForm
          initial={editingExpense ?? undefined}
          onSubmit={(data) => {
            if (!editingExpense) return;
            updateExpense(editingExpense.id, {
              ...data,
              comment: data.comment ?? "",
            });
            addToast("Витрату оновлено", "success");
            setEditingExpense(null);
          }}
          onCancel={() => setEditingExpense(null)}
        />
      </ModalForm>
    </div>
  );
};

export default FinancePage;
