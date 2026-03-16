import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  mockEarnings,
  mockExpenses,
  mockIncomes,
  mockPlans,
  mockSalaryPayouts,
  mockSalaryRecords,
} from "../data/mockData";
import { sendPlanToChannel } from "../lib/telegram";
import { today, uid } from "../lib/utils";
import { earningsService } from "../services/earningsService";
import { financeService } from "../services/financeService";
import { plansService } from "../services/plansService";
import { salaryService } from "../services/salaryService";
import type {
  EarningsRecord,
  Expense,
  Income,
  Plan,
  SalaryPayout,
  SalaryPayoutInput,
  SalaryRecord,
  StatsSummary,
  TaraEntry,
} from "../types/entities";

type AppState = {
  plans: Plan[];
  incomes: Income[];
  expenses: Expense[];
  salaryRecords: SalaryRecord[];
  salaryPayouts: SalaryPayout[];
  earningsRecords: EarningsRecord[];
  hydrateFromApi: () => Promise<void>;
  addPlan: (payload: Omit<Plan, "id" | "createdAt" | "updatedAt">) => void;
  updatePlan: (id: string, payload: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  markPlanDone: (id: string) => void;
  sendPlan: (id: string) => Promise<void>;
  addIncome: (payload: Omit<Income, "id" | "createdAt">) => void;
  addExpense: (payload: Omit<Expense, "id" | "createdAt">) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  addSalaryRecord: (payload: Omit<SalaryRecord, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateSalaryRecord: (id: string, payload: Partial<SalaryRecord>) => void;
  addSalaryPayout: (payload: SalaryPayoutInput) => void;
  addEarningsRecord: (payload: { date: string; comment?: string; entries: TaraEntry[] }) => void;
  getStatsSummary: () => StatsSummary;
};

const safeSync = <T>(fn: () => Promise<T>) => {
  void fn().catch(() => {
    // Non-blocking API sync: local UX stays responsive even if network fails.
  });
};

const resolveSalaryStatus = (totalAmount: number, alreadyPaid: number, owed: number) => {
  if (alreadyPaid <= 0) return "awaiting" as const;
  if (owed <= 0 || alreadyPaid >= totalAmount) return "paid" as const;
  return "partially_paid" as const;
};

const computeOwed = (record: SalaryRecord) => {
  const auto = Math.max(record.totalAmount - record.alreadyPaid, 0);
  if (typeof record.expectedToReceive === "number" && Number.isFinite(record.expectedToReceive)) {
    return Math.max(record.expectedToReceive, 0);
  }
  return auto;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      plans: mockPlans,
      incomes: mockIncomes,
      expenses: mockExpenses,
      salaryRecords: mockSalaryRecords,
      salaryPayouts: mockSalaryPayouts,
      earningsRecords: mockEarnings,

      hydrateFromApi: async () => {
        try {
          const [plans, incomes, expenses, salaryRecords, earningsRecords] = await Promise.all([
            plansService.list(),
            financeService.incomes.list(),
            financeService.expenses.list(),
            salaryService.records.list(),
            earningsService.list(),
          ]);

          set((state) => ({
            plans: plans.length ? plans : state.plans,
            incomes: incomes.length ? incomes : state.incomes,
            expenses: expenses.length ? expenses : state.expenses,
            salaryRecords: salaryRecords.length ? salaryRecords : state.salaryRecords,
            earningsRecords: earningsRecords.length ? earningsRecords : state.earningsRecords,
          }));
        } catch {
          // If API is unavailable, app continues with local persisted data.
        }
      },

      addPlan: (payload) => {
        const ts = new Date().toISOString();
        const plan: Plan = { id: uid(), createdAt: ts, updatedAt: ts, ...payload };
        set((state) => ({ plans: [plan, ...state.plans] }));
        safeSync(() => plansService.create(plan));
      },

      updatePlan: (id, payload) => {
        const nextPayload = { ...payload, updatedAt: new Date().toISOString() };
        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? { ...plan, ...nextPayload } : plan)),
        }));
        safeSync(() => plansService.update(id, nextPayload));
      },

      deletePlan: (id) => {
        set((state) => ({ plans: state.plans.filter((plan) => plan.id !== id) }));
        safeSync(() => plansService.remove(id));
      },

      markPlanDone: (id) => {
        get().updatePlan(id, { status: "done" });
      },

      sendPlan: async (id) => {
        const plan = get().plans.find((item) => item.id === id);
        if (!plan) throw new Error("План не знайдено");
        await sendPlanToChannel(plan);
      },

      addIncome: (payload) => {
        const created: Income = { ...payload, id: uid(), createdAt: new Date().toISOString() };
        set((state) => ({ incomes: [created, ...state.incomes] }));
        safeSync(() => financeService.incomes.create(created));
      },

      addExpense: (payload) => {
        const created: Expense = { ...payload, id: uid(), createdAt: new Date().toISOString() };
        set((state) => ({ expenses: [created, ...state.expenses] }));
        safeSync(() => financeService.expenses.create(created));
      },

      deleteIncome: (id) => {
        set((state) => ({ incomes: state.incomes.filter((item) => item.id !== id) }));
        safeSync(() => financeService.incomes.remove(id));
      },

      deleteExpense: (id) => {
        set((state) => ({ expenses: state.expenses.filter((item) => item.id !== id) }));
        safeSync(() => financeService.expenses.remove(id));
      },

      addSalaryRecord: (payload) => {
        const owed =
          typeof payload.expectedToReceive === "number"
            ? payload.expectedToReceive
            : Math.max(payload.totalAmount - payload.alreadyPaid, 0);

        const status = resolveSalaryStatus(payload.totalAmount, payload.alreadyPaid, owed);
        const record: SalaryRecord = {
          ...payload,
          id: uid(),
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ salaryRecords: [record, ...state.salaryRecords] }));
        safeSync(() => salaryService.records.create(record));
      },

      updateSalaryRecord: (id, payload) => {
        set((state) => ({
          salaryRecords: state.salaryRecords.map((record) => {
            if (record.id !== id) return record;
            const next = { ...record, ...payload, updatedAt: new Date().toISOString() };
            const owed = computeOwed(next);
            return {
              ...next,
              status: resolveSalaryStatus(next.totalAmount, next.alreadyPaid, owed),
            };
          }),
        }));
      },

      addSalaryPayout: ({ salaryRecordId, amount, payoutDate, comment }) => {
        const record = get().salaryRecords.find((item) => item.id === salaryRecordId);
        if (!record) throw new Error("Запис зарплати не знайдено");

        const nextPaid = record.alreadyPaid + amount;
        const autoOwed = Math.max(record.totalAmount - nextPaid, 0);
        const manualOwed =
          typeof record.expectedToReceive === "number"
            ? Math.max(record.expectedToReceive - amount, 0)
            : null;
        const effectiveOwed = manualOwed ?? autoOwed;
        const payoutId = uid();
        const sourceTag = `Виплата ЗП: ${record.source} (${salaryRecordId.slice(0, 6)})`;

        const payout: SalaryPayout = {
          id: payoutId,
          salaryRecordId,
          amount,
          payoutDate,
          comment,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          salaryPayouts: [payout, ...state.salaryPayouts],
          salaryRecords: state.salaryRecords.map((salary) =>
            salary.id === salaryRecordId
              ? {
                  ...salary,
                  alreadyPaid: nextPaid,
                  expectedToReceive: manualOwed,
                  status: resolveSalaryStatus(salary.totalAmount, nextPaid, effectiveOwed),
                  updatedAt: new Date().toISOString(),
                }
              : salary,
          ),
          incomes: [
            {
              id: uid(),
              amount,
              source: sourceTag,
              comment: comment || "Автоматично додано після видачі зарплати",
              date: payoutDate,
              incomeType: "salary_payout",
              status: "received",
              linkedSalaryPayoutId: payoutId,
              createdAt: new Date().toISOString(),
            },
            ...state.incomes,
          ],
        }));

        safeSync(() => salaryService.payouts.create(payout));
      },

      addEarningsRecord: ({ date, comment, entries }) => {
        const totalAmount = entries.reduce((acc, item) => acc + item.sum, 0);
        const record: EarningsRecord = {
          id: uid(),
          date,
          comment,
          entries,
          totalAmount,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ earningsRecords: [record, ...state.earningsRecords] }));
        safeSync(() => earningsService.create(record));
      },

      getStatsSummary: () => {
        const { plans, incomes, expenses, salaryRecords, earningsRecords } = get();
        const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
        const totalSalaryPlanned = salaryRecords.reduce((acc, s) => acc + s.totalAmount, 0);
        const totalSalaryPaid = salaryRecords.reduce((acc, s) => acc + s.alreadyPaid, 0);
        const totalSalaryOwed = salaryRecords.reduce((acc, s) => acc + computeOwed(s), 0);
        const totalEarnings = earningsRecords.reduce((acc, e) => acc + e.totalAmount, 0);

        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          totalSalaryPlanned,
          totalSalaryPaid,
          totalSalaryOwed,
          totalEarnings,
          totalPlans: plans.length,
          completedPlans: plans.filter((p) => p.status === "done").length,
          activePlans: plans.filter((p) => p.status === "planned").length,
        };
      },
    }),
    {
      name: "my-finance-mini-app-store",
      partialize: (state) => ({
        plans: state.plans,
        incomes: state.incomes,
        expenses: state.expenses,
        salaryRecords: state.salaryRecords,
        salaryPayouts: state.salaryPayouts,
        earningsRecords: state.earningsRecords,
      }),
    },
  ),
);

export const useTodayPlans = () => {
  const plans = useAppStore((state) => state.plans);
  const date = today();
  return plans.filter((plan) => plan.date === date);
};

