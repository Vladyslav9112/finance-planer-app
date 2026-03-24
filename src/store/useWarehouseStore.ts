import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EarningsRecord, SalaryPayout, TaraEntry, Income } from "../types";
import { generateId } from "../lib/utils";
import { useFinanceStore } from "./useFinanceStore";
import { mockEarningsRecords, mockSalaryPayouts } from "../data/mockData";

interface WarehouseState {
  earningsRecords: EarningsRecord[];
  salaryPayouts: SalaryPayout[];
  // Computed (derived from records)
  totalEarningsFromTara: number;
  totalPaidOut: number;
  totalAmountOwedToMe: number;
  // Actions — Earnings
  addEarningsRecord: (
    data: Omit<EarningsRecord, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateEarningsRecord: (
    id: string,
    data: Partial<Omit<EarningsRecord, "id" | "createdAt">>,
  ) => void;
  deleteEarningsRecord: (id: string) => void;
  // Actions — Salary Payout
  addSalaryPayout: (
    data: Omit<
      SalaryPayout,
      "id" | "createdAt" | "updatedAt" | "relatedIncomeId"
    >,
  ) => void;
  updateSalaryPayout: (
    id: string,
    data: Partial<Omit<SalaryPayout, "id" | "createdAt" | "relatedIncomeId">>,
  ) => void;
  deleteSalaryPayout: (id: string) => void;
  _recalculate: (
    earningsRecords: EarningsRecord[],
    salaryPayouts: SalaryPayout[],
  ) => {
    totalEarningsFromTara: number;
    totalPaidOut: number;
    totalAmountOwedToMe: number;
  };
}

const calcTotals = (
  earningsRecords: EarningsRecord[],
  salaryPayouts: SalaryPayout[],
) => {
  const totalEarningsFromTara = earningsRecords.reduce(
    (s, r) => s + r.totalAmount,
    0,
  );
  const totalPaidOut = salaryPayouts.reduce((s, p) => s + p.amount, 0);
  const totalAmountOwedToMe = totalEarningsFromTara - totalPaidOut;
  return { totalEarningsFromTara, totalPaidOut, totalAmountOwedToMe };
};

const initTotals = calcTotals(mockEarningsRecords, mockSalaryPayouts);

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set, get) => ({
      earningsRecords: mockEarningsRecords,
      salaryPayouts: mockSalaryPayouts,
      ...initTotals,

      _recalculate: (earningsRecords, salaryPayouts) =>
        calcTotals(earningsRecords, salaryPayouts),

      // ─── Earnings Records ───────────────────────────────────────────────────

      addEarningsRecord: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        const record: EarningsRecord = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => {
          const earningsRecords = [record, ...s.earningsRecords];
          return {
            earningsRecords,
            ...calcTotals(earningsRecords, s.salaryPayouts),
          };
        });
      },

      updateEarningsRecord: (id, data) => {
        const now = new Date().toISOString();
        set((s) => {
          const earningsRecords = s.earningsRecords.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: now } : r,
          );
          return {
            earningsRecords,
            ...calcTotals(earningsRecords, s.salaryPayouts),
          };
        });
      },

      deleteEarningsRecord: (id) => {
        set((s) => {
          const earningsRecords = s.earningsRecords.filter((r) => r.id !== id);
          return {
            earningsRecords,
            ...calcTotals(earningsRecords, s.salaryPayouts),
          };
        });
      },

      // ─── Salary Payouts ─────────────────────────────────────────────────────

      addSalaryPayout: (data) => {
        const payoutId = generateId();
        const incomeId = generateId();
        const now = new Date().toISOString();

        // Validate: cannot payout more than owed
        const { totalAmountOwedToMe } = get();
        if (data.amount > totalAmountOwedToMe) {
          throw new Error(
            `Сума виплати (${data.amount}) перевищує залишок до видачі (${totalAmountOwedToMe})`,
          );
        }

        // Create corresponding income
        const income: Income = {
          id: incomeId,
          amount: data.amount,
          source: data.source,
          comment: `Виплата ЗП: ${data.comment || data.source}`,
          date: data.date,
          type: "salary_payout",
          relatedSalaryPayoutId: payoutId,
          createdAt: now,
          updatedAt: now,
        };
        useFinanceStore.getState()._addIncomeInternal(income);

        const payout: SalaryPayout = {
          ...data,
          id: payoutId,
          relatedIncomeId: incomeId,
          createdAt: now,
          updatedAt: now,
        };

        set((s) => {
          const salaryPayouts = [payout, ...s.salaryPayouts];
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
      },

      updateSalaryPayout: (id, data) => {
        const now = new Date().toISOString();
        set((s) => {
          const existing = s.salaryPayouts.find((p) => p.id === id);
          if (!existing) return s;

          // If amount changes, validate new total
          if (data.amount !== undefined && data.amount !== existing.amount) {
            const otherPayouts = s.salaryPayouts.filter((p) => p.id !== id);
            const otherTotal = otherPayouts.reduce((a, p) => a + p.amount, 0);
            const newTotal = otherTotal + data.amount;
            if (newTotal > s.totalEarningsFromTara) {
              throw new Error("Загальна сума виплат перевищує зароблену суму");
            }
          }

          const salaryPayouts = s.salaryPayouts.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: now } : p,
          );

          // Update linked income
          if (existing.relatedIncomeId) {
            useFinanceStore
              .getState()
              ._updateIncomeInternal(existing.relatedIncomeId, {
                amount: data.amount ?? existing.amount,
                source: data.source ?? existing.source,
                date: data.date ?? existing.date,
                comment: `Виплата ЗП: ${data.comment ?? existing.comment ?? data.source ?? existing.source}`,
              });
          }

          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
      },

      deleteSalaryPayout: (id) => {
        set((s) => {
          const existing = s.salaryPayouts.find((p) => p.id === id);
          if (existing?.relatedIncomeId) {
            useFinanceStore.getState()._deleteIncomeByPayoutId(id);
          }
          const salaryPayouts = s.salaryPayouts.filter((p) => p.id !== id);
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
      },
    }),
    { name: "finance-planner-warehouse" },
  ),
);

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectEarningsInRange = (
  records: EarningsRecord[],
  from: string,
  to: string,
): EarningsRecord[] => records.filter((r) => r.date >= from && r.date <= to);
