import { create } from "zustand";
import type { Income, Expense } from "../types";
import { generateId, isInRange } from "../lib/utils";
import { apiIncomes, apiExpenses } from "../lib/apiClient";
import { useAppStore } from "./useAppStore";

interface FinanceState {
  incomes: Income[];
  expenses: Expense[];
  initialized: boolean;
  init: () => Promise<void>;
  addIncome: (data: Omit<Income, "id" | "createdAt" | "updatedAt">) => string;
  updateIncome: (
    id: string,
    data: Partial<Omit<Income, "id" | "createdAt">>,
  ) => void;
  deleteIncome: (id: string) => void;
  addExpense: (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => string;
  updateExpense: (
    id: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>,
  ) => void;
  deleteExpense: (id: string) => void;
  _addIncomeInternal: (income: Income) => void;
  _updateIncomeInternal: (id: string, data: Partial<Income>) => void;
  _deleteIncomeByPayoutId: (salaryPayoutId: string) => void;
}

export const useFinanceStore = create<FinanceState>()((set, get) => ({
  incomes: [],
  expenses: [],
  initialized: false,

  init: async () => {
    try {
      const [incomes, expenses] = await Promise.all([
        apiIncomes.getAll(),
        apiExpenses.getAll(),
      ]);
      set({ incomes, expenses, initialized: true });
    } catch (e: any) {
      console.error("[useFinanceStore] init error:", e);
      set({ initialized: true });
    }
  },

  addIncome: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const income: Income = { ...data, id, createdAt: now, updatedAt: now };
    set((s) => ({ incomes: [income, ...s.incomes] }));
    apiIncomes
      .create({ ...data, id })
      .then((created) => {
        set((s) => ({
          incomes: s.incomes.map((i) => (i.id === id ? created : i)),
        }));
      })
      .catch((e) => {
        set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) }));
        useAppStore
          .getState()
          .addToast("Помилка збереження доходу: " + e.message, "error");
      });
    return id;
  },

  updateIncome: (id, data) => {
    const prev = get().incomes.find((i) => i.id === id);
    const now = new Date().toISOString();
    set((s) => ({
      incomes: s.incomes.map((i) =>
        i.id === id ? { ...i, ...data, updatedAt: now } : i,
      ),
    }));
    apiIncomes
      .update(id, data)
      .then((updated) => {
        set((s) => ({
          incomes: s.incomes.map((i) => (i.id === id ? updated : i)),
        }));
      })
      .catch((e) => {
        if (prev)
          set((s) => ({
            incomes: s.incomes.map((i) => (i.id === id ? prev : i)),
          }));
        useAppStore
          .getState()
          .addToast("Помилка оновлення доходу: " + e.message, "error");
      });
  },

  deleteIncome: (id) => {
    const prev = get().incomes;
    set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) }));
    apiIncomes.remove(id).catch((e) => {
      set({ incomes: prev });
      useAppStore
        .getState()
        .addToast("Помилка видалення доходу: " + e.message, "error");
    });
  },

  addExpense: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const expense: Expense = { ...data, id, createdAt: now, updatedAt: now };
    set((s) => ({ expenses: [expense, ...s.expenses] }));
    apiExpenses
      .create({ ...data, id })
      .then((created) => {
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? created : e)),
        }));
      })
      .catch((e) => {
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
        useAppStore
          .getState()
          .addToast("Помилка збереження витрати: " + e.message, "error");
      });
    return id;
  },

  updateExpense: (id, data) => {
    const prev = get().expenses.find((e) => e.id === id);
    const now = new Date().toISOString();
    set((s) => ({
      expenses: s.expenses.map((e) =>
        e.id === id ? { ...e, ...data, updatedAt: now } : e,
      ),
    }));
    apiExpenses
      .update(id, data)
      .then((updated) => {
        set((s) => ({
          expenses: s.expenses.map((e) => (e.id === id ? updated : e)),
        }));
      })
      .catch((e) => {
        if (prev)
          set((s) => ({
            expenses: s.expenses.map((e) => (e.id === id ? prev : e)),
          }));
        useAppStore
          .getState()
          .addToast("Помилка оновлення витрати: " + e.message, "error");
      });
  },

  deleteExpense: (id) => {
    const prev = get().expenses;
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
    apiExpenses.remove(id).catch((e) => {
      set({ expenses: prev });
      useAppStore
        .getState()
        .addToast("Помилка видалення витрати: " + e.message, "error");
    });
  },

  _addIncomeInternal: (income) =>
    set((s) => ({ incomes: [income, ...s.incomes] })),

  _updateIncomeInternal: (id, data) => {
    const now = new Date().toISOString();
    set((s) => ({
      incomes: s.incomes.map((i) =>
        i.id === id ? { ...i, ...data, updatedAt: now } : i,
      ),
    }));
  },

  _deleteIncomeByPayoutId: (salaryPayoutId) =>
    set((s) => ({
      incomes: s.incomes.filter(
        (i) => i.relatedSalaryPayoutId !== salaryPayoutId,
      ),
    })),
}));

export const selectIncomesInRange = (
  incomes: Income[],
  from: string,
  to: string,
): Income[] => incomes.filter((i) => isInRange(i.date, from, to));

export const selectTotalIncome = (incomes: Income[]): number =>
  incomes.reduce((s, i) => s + i.amount, 0);

export const selectTotalExpenses = (expenses: Expense[]): number =>
  expenses.reduce((s, e) => s + e.amount, 0);
