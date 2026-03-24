import { create } from "zustand";
import type { EarningsRecord, SalaryPayout, Income } from "../types";
import { generateId } from "../lib/utils";
import { useFinanceStore } from "./useFinanceStore";
import { useAppStore } from "./useAppStore";
import { apiEarnings, apiSalaryPayouts } from "../lib/apiClient";

interface WarehouseState {
  earningsRecords: EarningsRecord[];
  salaryPayouts: SalaryPayout[];
  totalEarningsFromTara: number;
  totalPaidOut: number;
  totalAmountOwedToMe: number;
  initialized: boolean;
  init: () => Promise<void>;
  addEarningsRecord: (
    data: Omit<EarningsRecord, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateEarningsRecord: (
    id: string,
    data: Partial<Omit<EarningsRecord, "id" | "createdAt">>,
  ) => void;
  deleteEarningsRecord: (id: string) => void;
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
}

const calcTotals = (
  earningsRecords: EarningsRecord[],
  salaryPayouts: SalaryPayout[],
) => ({
  totalEarningsFromTara: earningsRecords.reduce((s, r) => s + r.totalAmount, 0),
  totalPaidOut: salaryPayouts.reduce((s, p) => s + p.amount, 0),
  totalAmountOwedToMe:
    earningsRecords.reduce((s, r) => s + r.totalAmount, 0) -
    salaryPayouts.reduce((s, p) => s + p.amount, 0),
});

export const useWarehouseStore = create<WarehouseState>()((set, get) => ({
  earningsRecords: [],
  salaryPayouts: [],
  totalEarningsFromTara: 0,
  totalPaidOut: 0,
  totalAmountOwedToMe: 0,
  initialized: false,

  init: async () => {
    try {
      const [earningsRecords, salaryPayouts] = await Promise.all([
        apiEarnings.getAll(),
        apiSalaryPayouts.getAll(),
      ]);
      set({
        earningsRecords,
        salaryPayouts,
        ...calcTotals(earningsRecords, salaryPayouts),
        initialized: true,
      });
    } catch (e: any) {
      console.error("[useWarehouseStore] init error:", e);
      set({ initialized: true });
    }
  },

  // ─── Earnings Records ───────────────────────────────────────────────────────

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
    apiEarnings
      .create({ ...data, id })
      .then((created) => {
        set((s) => ({
          earningsRecords: s.earningsRecords.map((r) =>
            r.id === id ? created : r,
          ),
          ...calcTotals(
            s.earningsRecords.map((r) => (r.id === id ? created : r)),
            s.salaryPayouts,
          ),
        }));
      })
      .catch((e) => {
        set((s) => {
          const earningsRecords = s.earningsRecords.filter((r) => r.id !== id);
          return {
            earningsRecords,
            ...calcTotals(earningsRecords, s.salaryPayouts),
          };
        });
        useAppStore
          .getState()
          .addToast("Помилка збереження запису: " + e.message, "error");
      });
  },

  updateEarningsRecord: (id, data) => {
    const prev = get().earningsRecords.find((r) => r.id === id);
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
    apiEarnings
      .update(id, data)
      .then((updated) => {
        set((s) => {
          const earningsRecords = s.earningsRecords.map((r) =>
            r.id === id ? updated : r,
          );
          return {
            earningsRecords,
            ...calcTotals(earningsRecords, s.salaryPayouts),
          };
        });
      })
      .catch((e) => {
        if (prev) {
          set((s) => {
            const earningsRecords = s.earningsRecords.map((r) =>
              r.id === id ? prev : r,
            );
            return {
              earningsRecords,
              ...calcTotals(earningsRecords, s.salaryPayouts),
            };
          });
        }
        useAppStore
          .getState()
          .addToast("Помилка оновлення запису: " + e.message, "error");
      });
  },

  deleteEarningsRecord: (id) => {
    const prevRecords = get().earningsRecords;
    set((s) => {
      const earningsRecords = s.earningsRecords.filter((r) => r.id !== id);
      return {
        earningsRecords,
        ...calcTotals(earningsRecords, s.salaryPayouts),
      };
    });
    apiEarnings.remove(id).catch((e) => {
      set((s) => ({
        earningsRecords: prevRecords,
        ...calcTotals(prevRecords, s.salaryPayouts),
      }));
      useAppStore
        .getState()
        .addToast("Помилка видалення запису: " + e.message, "error");
    });
  },

  // ─── Salary Payouts ─────────────────────────────────────────────────────────

  addSalaryPayout: (data) => {
    const { totalAmountOwedToMe } = get();
    if (data.amount > totalAmountOwedToMe) {
      throw new Error(
        `Сума виплати (${data.amount}) перевищує залишок до видачі (${totalAmountOwedToMe})`,
      );
    }
    const payoutId = generateId();
    const incomeId = generateId();
    const now = new Date().toISOString();

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
    const payout: SalaryPayout = {
      ...data,
      id: payoutId,
      relatedIncomeId: incomeId,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update
    useFinanceStore.getState()._addIncomeInternal(income);
    set((s) => {
      const salaryPayouts = [payout, ...s.salaryPayouts];
      return { salaryPayouts, ...calcTotals(s.earningsRecords, salaryPayouts) };
    });

    apiSalaryPayouts
      .create({ ...data, id: payoutId, incomeId })
      .then(({ payout: sp, income: si }) => {
        set((s) => {
          const salaryPayouts = s.salaryPayouts.map((p) =>
            p.id === payoutId ? sp : p,
          );
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
        useFinanceStore.getState()._updateIncomeInternal(incomeId, si);
      })
      .catch((e) => {
        // Revert
        useFinanceStore.getState()._deleteIncomeByPayoutId(payoutId);
        set((s) => {
          const salaryPayouts = s.salaryPayouts.filter(
            (p) => p.id !== payoutId,
          );
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
        useAppStore
          .getState()
          .addToast("Помилка видачі ЗП: " + e.message, "error");
      });
  },

  updateSalaryPayout: (id, data) => {
    const s0 = get();
    const existing = s0.salaryPayouts.find((p) => p.id === id);
    if (!existing) return;

    if (data.amount !== undefined && data.amount !== existing.amount) {
      const otherTotal = s0.salaryPayouts
        .filter((p) => p.id !== id)
        .reduce((a, p) => a + p.amount, 0);
      if (otherTotal + data.amount > s0.totalEarningsFromTara) {
        throw new Error("Загальна сума виплат перевищує зароблену суму");
      }
    }

    const now = new Date().toISOString();
    set((s) => {
      const salaryPayouts = s.salaryPayouts.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: now } : p,
      );
      return { salaryPayouts, ...calcTotals(s.earningsRecords, salaryPayouts) };
    });
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

    apiSalaryPayouts
      .update(id, data)
      .then(({ payout, income }) => {
        set((s) => {
          const salaryPayouts = s.salaryPayouts.map((p) =>
            p.id === id ? payout : p,
          );
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
        if (income && existing.relatedIncomeId) {
          useFinanceStore
            .getState()
            ._updateIncomeInternal(existing.relatedIncomeId, income);
        }
      })
      .catch((e) => {
        // Revert to previous state
        set((s) => {
          const salaryPayouts = s.salaryPayouts.map((p) =>
            p.id === id ? existing : p,
          );
          return {
            salaryPayouts,
            ...calcTotals(s.earningsRecords, salaryPayouts),
          };
        });
        if (existing.relatedIncomeId) {
          useFinanceStore
            .getState()
            ._updateIncomeInternal(existing.relatedIncomeId, {
              amount: existing.amount,
              source: existing.source,
              date: existing.date,
            });
        }
        useAppStore
          .getState()
          .addToast("Помилка оновлення виплати: " + e.message, "error");
      });
  },

  deleteSalaryPayout: (id) => {
    const existing = get().salaryPayouts.find((p) => p.id === id);
    if (existing?.relatedIncomeId) {
      useFinanceStore.getState()._deleteIncomeByPayoutId(id);
    }
    const prevPayouts = get().salaryPayouts;
    set((s) => {
      const salaryPayouts = s.salaryPayouts.filter((p) => p.id !== id);
      return { salaryPayouts, ...calcTotals(s.earningsRecords, salaryPayouts) };
    });
    apiSalaryPayouts.remove(id).catch((e) => {
      // Revert
      set((s) => ({
        salaryPayouts: prevPayouts,
        ...calcTotals(s.earningsRecords, prevPayouts),
      }));
      useAppStore
        .getState()
        .addToast("Помилка видалення виплати: " + e.message, "error");
    });
  },
}));

export const selectEarningsInRange = (
  records: EarningsRecord[],
  from: string,
  to: string,
): EarningsRecord[] => records.filter((r) => r.date >= from && r.date <= to);
