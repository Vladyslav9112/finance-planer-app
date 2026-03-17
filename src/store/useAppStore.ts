import { create } from "zustand";
import { persist } from "zustand/middleware";
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

type EarningsPayload = { date: string; comment?: string; entries: TaraEntry[] };

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
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addSalaryRecord: (payload: Omit<SalaryRecord, "id" | "createdAt" | "updatedAt" | "status">) => void;
  updateSalaryRecord: (id: string, payload: Partial<SalaryRecord>) => void;
  addSalaryPayout: (payload: SalaryPayoutInput) => void;
  addEarningsRecord: (payload: EarningsPayload) => void;
  updateEarningsRecord: (id: string, payload: EarningsPayload) => Promise<void>;
  deleteEarningsRecord: (id: string) => Promise<void>;
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

const earningsMarker = (earningsId: string) => `[earnings:${earningsId}]`;

const toSalaryComment = (earningsId: string, comment?: string) =>
  [earningsMarker(earningsId), comment?.trim()].filter(Boolean).join(" ");

const stripEarningsMarker = (comment?: string) =>
  comment?.replace(/^\[earnings:[^\]]+\]\s*/, "").trim() || undefined;

const findSalaryRecordForEarnings = (salaryRecords: SalaryRecord[], earningsId: string) =>
  salaryRecords.find((record) => record.comment?.includes(earningsMarker(earningsId)));

const buildSalaryRecordFromEarnings = (
  earningsId: string,
  payload: EarningsPayload,
  previous?: SalaryRecord,
): SalaryRecord => {
  const totalAmount = payload.entries.reduce((acc, item) => acc + item.sum, 0);
  const alreadyPaid = previous?.alreadyPaid ?? 0;
  const nextOwed = Math.max(totalAmount - alreadyPaid, 0);
  const createdAt = previous?.createdAt ?? new Date().toISOString();
  const updatedAt = new Date().toISOString();

  return {
    id: previous?.id ?? uid(),
    source: `Склад / тара ${payload.date}`,
    totalAmount,
    alreadyPaid,
    expectedToReceive: nextOwed,
    comment: toSalaryComment(earningsId, payload.comment),
    date: payload.date,
    status: resolveSalaryStatus(totalAmount, alreadyPaid, nextOwed),
    createdAt,
    updatedAt,
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      plans: [],
      incomes: [],
      expenses: [],
      salaryRecords: [],
      salaryPayouts: [],
      earningsRecords: [],

      hydrateFromApi: async () => {
        try {
          const [plans, incomes, expenses, salaryRecords, earningsRecords] = await Promise.all([
            plansService.list(),
            financeService.incomes.list(),
            financeService.expenses.list(),
            salaryService.records.list(),
            earningsService.list(),
          ]);

          set(() => ({
            plans,
            incomes,
            expenses,
            salaryRecords,
            earningsRecords,
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

      deleteIncome: async (id) => {
        await financeService.incomes.remove(id);
        set((state) => ({ incomes: state.incomes.filter((item) => item.id !== id) }));
      },

      deleteExpense: async (id) => {
        await financeService.expenses.remove(id);
        set((state) => ({ expenses: state.expenses.filter((item) => item.id !== id) }));
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

        const effectivePayoutDate = payoutDate || new Date().toISOString().slice(0, 10);
        const nextPaid = record.alreadyPaid + amount;
        const autoOwed = Math.max(record.totalAmount - nextPaid, 0);
        const manualOwed =
          typeof record.expectedToReceive === "number"
            ? Math.max(record.expectedToReceive - amount, 0)
            : null;
        const effectiveOwed = manualOwed ?? autoOwed;
        const payout: SalaryPayout = {
          id: uid(),
          salaryRecordId,
          amount,
          payoutDate: effectivePayoutDate,
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
        }));

        safeSync(() => salaryService.payouts.create(payout));
      },

      addEarningsRecord: (payload) => {
        const now = new Date().toISOString();
        const totalAmount = payload.entries.reduce((acc, item) => acc + item.sum, 0);
        const earningsId = uid();
        const record: EarningsRecord = {
          id: earningsId,
          date: payload.date,
          comment: payload.comment,
          entries: payload.entries,
          totalAmount,
          createdAt: now,
        };

        const salaryRecord = buildSalaryRecordFromEarnings(earningsId, payload);

        set((state) => ({
          earningsRecords: [record, ...state.earningsRecords],
          salaryRecords: [salaryRecord, ...state.salaryRecords],
        }));
        safeSync(() => earningsService.create(record));
      },

      updateEarningsRecord: async (id, payload) => {
        await earningsService.update(id, payload);

        set((state) => {
          const currentSalaryRecord = findSalaryRecordForEarnings(state.salaryRecords, id);
          const nextSalaryRecord = buildSalaryRecordFromEarnings(id, payload, currentSalaryRecord);

          return {
            earningsRecords: state.earningsRecords.map((record) =>
              record.id === id
                ? {
                    ...record,
                    date: payload.date,
                    comment: payload.comment,
                    entries: payload.entries,
                    totalAmount: payload.entries.reduce((acc, item) => acc + item.sum, 0),
                  }
                : record,
            ),
            salaryRecords: currentSalaryRecord
              ? state.salaryRecords.map((record) => (record.id === currentSalaryRecord.id ? nextSalaryRecord : record))
              : [nextSalaryRecord, ...state.salaryRecords],
          };
        });
      },

      deleteEarningsRecord: async (id) => {
        await earningsService.remove(id);
        set((state) => ({
          earningsRecords: state.earningsRecords.filter((record) => record.id !== id),
          salaryRecords: state.salaryRecords.filter((record) => !record.comment?.includes(earningsMarker(id))),
        }));
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
      name: "my-finance-mini-app-store-v2",
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

export { stripEarningsMarker };
