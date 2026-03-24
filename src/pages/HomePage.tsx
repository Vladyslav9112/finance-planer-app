import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  CalendarCheck,
  Wallet,
  Package,
  Banknote,
  TrendingUp,
  ListTodo,
} from "lucide-react";
import dayjs from "dayjs";
import { useFinanceStore } from "../store/useFinanceStore";
import { usePlanStore, selectTodayPlans } from "../store/usePlanStore";
import { useWarehouseStore } from "../store/useWarehouseStore";
import { useAppStore } from "../store/useAppStore";
import { SummaryCard } from "../components/ui/SummaryCard";
import { GlassCard } from "../components/ui/GlassCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ModalForm } from "../components/ui/ModalForm";
import { PlanForm } from "../components/plans/PlanForm";
import { IncomeForm } from "../components/finance/IncomeForm";
import { ExpenseForm } from "../components/finance/ExpenseForm";
import { SalaryPayoutForm } from "../components/warehouse/SalaryPayoutForm";
import { TaraCalculator } from "../components/warehouse/TaraCalculator";
import { PlanCard } from "../components/plans/PlanCard";
import { Badge } from "../components/ui/Badge";
import { formatCurrency, today } from "../lib/utils";
import { warehouseService } from "../services/warehouseService";
import { sendPlanToChannel } from "../services/telegramService";
import type { TaraEntry } from "../types";

type QuickModal = "plan" | "income" | "expense" | "tara" | "salary" | null;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState<QuickModal>(null);

  const { incomes, expenses, addIncome, addExpense } = useFinanceStore();
  const { plans, addPlan, updatePlan, deletePlan, markComplete } =
    usePlanStore();
  const todayPlans = usePlanStore(selectTodayPlans);
  const { totalAmountOwedToMe, addSalaryPayout } = useWarehouseStore();
  const { addToast } = useAppStore();

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const activePlansCount = plans.filter((p) => p.status === "scheduled").length;

  const greeting = () => {
    const h = dayjs().hour();
    if (h < 6) return "Добраніч";
    if (h < 12) return "Доброго ранку";
    if (h < 18) return "Доброго дня";
    return "Доброго вечора";
  };

  const closeModal = () => setModal(null);

  const quickActions = [
    {
      key: "plan",
      label: "Додати план",
      Icon: CalendarCheck,
      color: "text-accent-teal",
      bg: "bg-accent-teal/12 border-accent-teal/20",
    },
    {
      key: "income",
      label: "Дохід",
      Icon: TrendingUp,
      color: "text-accent-lime",
      bg: "bg-accent-lime/12 border-accent-lime/20",
    },
    {
      key: "expense",
      label: "Витрата",
      Icon: Wallet,
      color: "text-rose-400",
      bg: "bg-rose-500/12 border-rose-500/20",
    },
    {
      key: "tara",
      label: "Тара",
      Icon: Package,
      color: "text-accent-violet",
      bg: "bg-accent-violet/12 border-accent-violet/20",
    },
    {
      key: "salary",
      label: "Видати ЗП",
      Icon: Banknote,
      color: "text-accent-lime",
      bg: "bg-accent-lime/12 border-accent-lime/20",
    },
  ] as const;

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs text-white/35 font-500 mb-0.5 uppercase tracking-widest">
          {dayjs().format("dddd, D MMMM")}
        </p>
        <h1 className="text-2xl font-800 text-white">{greeting()} 👋</h1>
        <p className="text-sm text-white/40 mt-1">Finance Planner</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          title="Баланс"
          value={balance}
          icon={<Wallet size={18} />}
          isCurrency
          accentColor={balance >= 0 ? "teal" : "rose"}
          delay={0.05}
        />
        <SummaryCard
          title="Витрати"
          value={totalExpenses}
          icon={<Wallet size={18} />}
          isCurrency
          accentColor="rose"
          delay={0.1}
        />
        <SummaryCard
          title="Доходи"
          value={totalIncome}
          icon={<TrendingUp size={18} />}
          isCurrency
          accentColor="lime"
          delay={0.15}
        />
        <SummaryCard
          title="Активні плани"
          value={activePlansCount}
          icon={<ListTodo size={18} />}
          accentColor="teal"
          delay={0.2}
        />
      </div>

      {/* Quick actions */}
      <div>
        <SectionHeader title="Швидкі дії" />
        <div className="flex gap-2 flex-wrap">
          {quickActions.map(({ key, label, Icon, color, bg }, i) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => setModal(key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-700 ${bg} ${color} transition-all active:scale-95`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Today's plans */}
      <div>
        <SectionHeader
          title="Плани на сьогодні"
          subtitle={
            todayPlans.length > 0 ? `${todayPlans.length} активних` : undefined
          }
          action={
            <button
              onClick={() => navigate("/planner")}
              className="text-xs text-accent-teal font-600 hover:underline"
            >
              Всі плани
            </button>
          }
        />

        {todayPlans.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck size={28} />}
            title="Планів на сьогодні немає"
            description="Додайте новий план або перегляньте всі заплановані задачі"
            action={
              <button
                onClick={() => setModal("plan")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-teal/15 border border-accent-teal/30 text-accent-teal text-xs font-700"
              >
                <Plus size={13} />
                Додати план
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {todayPlans.slice(0, 3).map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={i}
                onEdit={() => {}}
                onDelete={(id) => {
                  deletePlan(id);
                  addToast("План видалено", "info");
                }}
                onMarkComplete={(id) => {
                  markComplete(id);
                  addToast("План виконано! ✅", "success");
                }}
                onSendToChannel={async (p) => {
                  const ok = await sendPlanToChannel(p);
                  addToast(
                    ok ? "Відправлено в канал" : "Помилка відправки",
                    ok ? "success" : "error",
                  );
                }}
              />
            ))}
            {todayPlans.length > 3 && (
              <button
                onClick={() => navigate("/planner")}
                className="w-full py-2.5 rounded-xl border border-white/[0.07] text-xs text-white/40 font-600 hover:border-white/12 hover:text-white/60 transition-colors"
              >
                +{todayPlans.length - 3} більше...
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalForm
        isOpen={modal === "plan"}
        onClose={closeModal}
        title="Новий план"
      >
        <PlanForm
          onSubmit={(data) => {
            addPlan({
              ...data,
              description: data.description ?? "",
              category: data.category ?? "",
              time: data.time ?? "",
            });
            addToast("План додано", "success");
            closeModal();
          }}
          onCancel={closeModal}
        />
      </ModalForm>

      <ModalForm
        isOpen={modal === "income"}
        onClose={closeModal}
        title="Новий дохід"
      >
        <IncomeForm
          onSubmit={(data) => {
            addIncome({
              ...data,
              comment: data.comment ?? "",
              relatedSalaryPayoutId: undefined,
            });
            addToast("Дохід додано", "success");
            closeModal();
          }}
          onCancel={closeModal}
        />
      </ModalForm>

      <ModalForm
        isOpen={modal === "expense"}
        onClose={closeModal}
        title="Нова витрата"
      >
        <ExpenseForm
          onSubmit={(data) => {
            addExpense({
              amount: data.amount,
              category: data.category,
              comment: data.comment ?? "",
              date: data.date,
            });
            addToast("Витрату додано", "success");
            closeModal();
          }}
          onCancel={closeModal}
        />
      </ModalForm>

      <ModalForm
        isOpen={modal === "tara"}
        onClose={closeModal}
        title="Заробіток по тарі"
      >
        <TaraCalculator
          onSave={(
            entries: TaraEntry[],
            totalAmount: number,
            date: string,
            comment: string,
          ) => {
            try {
              warehouseService.addEarningsRecord({
                date,
                entries,
                totalAmount,
                comment,
              });
              addToast(
                `Заробіток ${formatCurrency(totalAmount)} збережено`,
                "success",
              );
              closeModal();
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
        />
      </ModalForm>

      <ModalForm
        isOpen={modal === "salary"}
        onClose={closeModal}
        title="Видати зарплату"
      >
        <SalaryPayoutForm
          maxAmount={totalAmountOwedToMe}
          onSubmit={(data) => {
            try {
              warehouseService.addSalaryPayout(data);
              addToast(`ЗП ${formatCurrency(data.amount)} видано`, "success");
              closeModal();
            } catch (e) {
              addToast((e as Error).message, "error");
            }
          }}
          onCancel={closeModal}
        />
      </ModalForm>
    </div>
  );
};

export default HomePage;
